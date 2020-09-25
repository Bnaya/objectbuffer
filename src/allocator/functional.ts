import { createHeap } from "../structsGenerator/consts";
import type {
  AllocatorInitOpts,
  AllocatorStats,
  Pow2,
  AllocatorState,
} from "./functionalInterfaces";

const STATE_FREE = 0;
const STATE_USED = 1;
const STATE_TOP = 2;
const STATE_END = 3;
const STATE_ALIGN = 4;
const STATE_FLAGS = 5;
const STATE_MIN_SPLIT = 6;

const MASK_COMPACT = 1;
const MASK_SPLIT = 2;

const SIZEOF_STATE = 7 * 4;

const MEM_BLOCK_SIZE = 0;
const MEM_BLOCK_NEXT = 1;

const SIZEOF_MEM_BLOCK = 2 * 4;

export function allocatorInit(
  options: Readonly<AllocatorInitOpts>,
  useShareArrayBuffer = false
): Readonly<AllocatorState> {
  invariant(options.align >= 8, "align must be >= 8");
  invariant(options.align % 8 === 0, "align must be multiplication of 8");

  const buf = useShareArrayBuffer
    ? new SharedArrayBuffer(options.size)
    : new ArrayBuffer(options.size);

  const state = new Uint32Array(buf, options.start, SIZEOF_STATE / 4);

  const top = initialTop(options.start, options.align as Pow2);
  const resolvedEnd =
    options.end != null
      ? Math.min(options.end, buf.byteLength)
      : buf.byteLength;

  set_align(state, options.align);
  set_doCompact(state, options.compact);
  set_doSplit(state, options.split);
  set_minSplit(state, options.minSplit);
  set_end(state, resolvedEnd);
  set_top(state, top);
  set__free(state, 0);
  set__used(state, 0);

  if (top >= resolvedEnd) {
    throw new Error(
      `insufficient address range (0x${options.start.toString(
        16
      )} - 0x${resolvedEnd.toString(16)})`
    );
  }

  return {
    options,
    ...createHeap(buf),
    state,
  };
}

export function listAllAllocatedPointers(allocatorState: AllocatorState) {
  const pointers: Array<{
    blockPointer: number;
    pointer: number;
    size: number;
  }> = [];

  const { u32, state } = allocatorState;

  let iteratedBlock = get__used(state);

  while (iteratedBlock !== 0) {
    pointers.push({
      blockPointer: iteratedBlock,
      pointer: iteratedBlock + SIZEOF_MEM_BLOCK,
      size: blockSize(u32, iteratedBlock),
    });

    iteratedBlock = blockNext(u32, iteratedBlock);
  }

  return pointers;
}

/**
 * When we want to create allocator from an existing array buffer
 * The array buffer is expected to already be initialized!
 * @param buf
 * @param start
 */
export function loadAllocator(
  buf: ArrayBuffer | SharedArrayBuffer,
  start: number
): Readonly<AllocatorState> {
  const state = new Uint32Array(buf, start, SIZEOF_STATE / 4);

  const options: AllocatorInitOpts = {
    start,
    end: get_end(state),
    size: buf.byteLength,
    align: get_align(state),
    split: get_doSplit(state),
    minSplit: get_minSplit(state),
    compact: get_doCompact(state),
  };

  return {
    options,
    ...createHeap(buf),
    state,
  };
}

export function calloc(
  allocatorState: AllocatorState,
  bytes: number,
  fill = 0
): number {
  const addr = malloc(allocatorState, bytes);
  addr && allocatorState.u8.fill(fill, addr, addr + bytes);
  return addr;
}

export function malloc(allocatorState: AllocatorState, bytes: number): number {
  if (bytes <= 0) {
    return 0;
  }

  const state = allocatorState.state;
  const u32 = allocatorState.u32;

  const paddedSize = align(bytes + SIZEOF_MEM_BLOCK, get_align(state));
  const end = get_end(state);
  let top = get_top(state);
  let block = get__free(state);
  let prev = 0;
  while (block) {
    const itrBlockSize = blockSize(u32, block);
    const isTop = block + itrBlockSize >= top;
    if (isTop || itrBlockSize >= paddedSize) {
      if (isTop && block + paddedSize > end) {
        return 0;
      }
      if (prev) {
        unlinkBlock(u32, prev, block);
      } else {
        set__free(state, blockNext(u32, block));
      }
      setBlockNext(u32, block, get__used(state));
      set__used(state, block);
      if (isTop) {
        set_top(state, block + setBlockSize(u32, block, paddedSize));
        // this.top = block + this.setBlockSize(block, paddedSize);
      } else if (get_doSplit(state)) {
        const excess = itrBlockSize - paddedSize;
        excess >= get_minSplit(state) &&
          splitBlock(state, u32, block, paddedSize, excess);
      }
      return blockDataAddress(block);
    }
    prev = block;
    block = blockNext(u32, block);
  }
  block = top;
  top = block + paddedSize;
  if (top <= end) {
    initBlock(u32, block, paddedSize, get__used(state));
    set__used(state, block);
    set_top(state, top);
    return blockDataAddress(block);
  }
  return 0;
}

export function realloc(
  allocatorState: AllocatorState,
  ptr: number,
  bytes: number
): number {
  if (bytes <= 0) {
    return 0;
  }

  const state = allocatorState.state;
  const u32 = allocatorState.u32;
  const u8 = allocatorState.u8;

  const oldAddr = blockSelfAddress(ptr);
  let newAddr = 0;
  let block = get__used(state);
  let blockEnd = 0;
  while (block) {
    if (block === oldAddr) {
      const itrBlockSize = blockSize(u32, block);
      blockEnd = oldAddr + itrBlockSize;
      const isTop = blockEnd >= get_top(state);
      const paddedSize = align(bytes + SIZEOF_MEM_BLOCK, get_align(state));
      // shrink & possibly split existing block
      if (paddedSize <= itrBlockSize) {
        if (get_doSplit(state)) {
          const excess = itrBlockSize - paddedSize;
          if (excess >= get_minSplit(state)) {
            splitBlock(state, u32, block, paddedSize, excess);
          } else if (isTop) {
            set_top(state, oldAddr + paddedSize);
            // this.top = oldAddr + paddedSize;
          }
        } else if (isTop) {
          set_top(state, oldAddr + paddedSize);
          // this.top = oldAddr + paddedSize;
        }
        newAddr = oldAddr;
        break;
      }
      // try to enlarge block if current top
      if (isTop && oldAddr + paddedSize < get_end(state)) {
        set_top(state, oldAddr + setBlockSize(u32, block, paddedSize));
        newAddr = oldAddr;
        break;
      }
      // fallback to free & malloc
      free(allocatorState, oldAddr);
      newAddr = blockSelfAddress(malloc(allocatorState, bytes));
      break;
    }
    block = blockNext(u32, block);
  }
  // copy old block contents to new addr
  if (newAddr && newAddr !== oldAddr) {
    u8.copyWithin(
      blockDataAddress(newAddr),
      blockDataAddress(oldAddr),
      blockEnd
    );
  }
  return blockDataAddress(newAddr);
}

export function free(allocatorState: AllocatorState, ptr: number): boolean {
  const state = allocatorState.state;
  const u32 = allocatorState.u32;

  let addr: number = ptr;
  addr = blockSelfAddress(addr);
  let block = get__used(state);
  let prev = 0;
  while (block) {
    if (block === addr) {
      if (prev) {
        unlinkBlock(u32, prev, block);
      } else {
        set__used(state, blockNext(u32, block));
      }
      insert(state, u32, block);
      if (get_doCompact(state)) {
        compact(state, u32);
      }
      return true;
    }
    prev = block;
    block = blockNext(u32, block);
  }
  return false;
}

export function freeAll(allocatorState: AllocatorState): void {
  const state = allocatorState.state;
  const options = allocatorState.options;
  set__free(state, 0);
  set__used(state, 0);
  set_top(state, initialTop(options.start, get_align(state) as Pow2));
}

export function stats(
  allocatorState: Readonly<AllocatorState>
): Readonly<AllocatorStats> {
  const listStats = (block: number) => {
    let count = 0;
    let size = 0;
    while (block) {
      count++;
      size += blockSize(allocatorState.u32, block);
      block = blockNext(allocatorState.u32, block);
    }
    return { count, size };
  };

  const free = listStats(get__free(allocatorState.state));
  return {
    free,
    used: listStats(get__used(allocatorState.state)),
    top: get_top(allocatorState.state),
    available:
      get_end(allocatorState.state) - get_top(allocatorState.state) + free.size,
    total: allocatorState.u8.buffer.byteLength,
  };
}

/**
 * To be used after ArrayBuffer change
 */
export function setEnd(allocatorState: AllocatorState, newEnd: number) {
  set_end(allocatorState.state, newEnd);
}

// export function release() {
//     // NOOP
//     // delete this.u8;
//     // delete this.u32;
//     // delete this.state;
//     // delete this.buf;
//     // return true;
// }

function invariant(assertionResult: boolean, message: string): void {
  if (!assertionResult) {
    throw new Error("Invariant: " + message);
  }
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
function get_align(state: Uint32Array): Pow2 {
  return <Pow2>state[STATE_ALIGN];
}

function set_align(state: Uint32Array, x: Pow2): void {
  state[STATE_ALIGN] = x;
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
export function get_end(state: Uint32Array): number {
  return state[STATE_END];
}

function set_end(state: Uint32Array, x: number): void {
  state[STATE_END] = x;
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
export function get_top(state: Uint32Array): number {
  return state[STATE_TOP];
}

function set_top(state: Uint32Array, x: number): void {
  state[STATE_TOP] = x;
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
export function get__free(state: Uint32Array): number {
  return state[STATE_FREE];
}

function set__free(state: Uint32Array, block: number): void {
  state[STATE_FREE] = block;
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
export function get__used(state: Uint32Array): number {
  return state[STATE_USED];
}

function set__used(state: Uint32Array, block: number): void {
  state[STATE_USED] = block;
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
export function get_doCompact(state: Uint32Array): boolean {
  return !!(state[STATE_FLAGS] & MASK_COMPACT);
}

function set_doCompact(state: Uint32Array, flag: boolean): void {
  if (flag) {
    state[STATE_FLAGS] |= 1 << (MASK_COMPACT - 1);
  } else {
    state[STATE_FLAGS] &= ~MASK_COMPACT;
  }
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
export function get_doSplit(state: Uint32Array): boolean {
  return !!(state[STATE_FLAGS] & MASK_SPLIT);
}

function set_doSplit(state: Uint32Array, flag: boolean): void {
  if (flag) {
    state[STATE_FLAGS] |= 1 << (MASK_SPLIT - 1);
  } else {
    state[STATE_FLAGS] &= ~MASK_SPLIT;
  }
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 */
function get_minSplit(state: Uint32Array): number {
  return state[STATE_MIN_SPLIT];
}

function set_minSplit(state: Uint32Array, x: number): void {
  invariant(
    x > SIZEOF_MEM_BLOCK,
    `illegal min split threshold: ${x}, require at least ${
      SIZEOF_MEM_BLOCK + 1
    }`
  );
  state[STATE_MIN_SPLIT] = x;
}

function initialTop(start: number, _align: Pow2): number {
  return (
    align(start + SIZEOF_STATE + SIZEOF_MEM_BLOCK, _align) - SIZEOF_MEM_BLOCK
  );
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 * @param u32
 * @param block
 */
export function blockSize(u32: Uint32Array, block: number): number {
  return u32[(block >> 2) + MEM_BLOCK_SIZE];
}

/**
 * Sets & returns given block size.
 *
 * @param block -
 * @param size -
 */
function setBlockSize(u32: Uint32Array, block: number, size: number): number {
  u32[(block >> 2) + MEM_BLOCK_SIZE] = size;
  return size;
}

/**
 * Exported for testing proposes only
 * @private
 * @param u32
 * @param block
 */
export function blockNext(u32: Uint32Array, block: number): number {
  return u32[(block >> 2) + MEM_BLOCK_NEXT];
}

/**
 * Sets block next pointer to `next`. Use zero to indicate list end.
 *
 * @param block -
 */
function setBlockNext(u32: Uint32Array, block: number, next: number): void {
  u32[(block >> 2) + MEM_BLOCK_NEXT] = next;
}

/**
 * Initializes block header with given `size` and `next` pointer. Returns `block`.
 *
 * @param block -
 * @param size -
 * @param next -
 */
function initBlock(
  u32: Uint32Array,
  block: number,
  size: number,
  next: number
): number {
  const idx = block >>> 2;
  u32[idx + MEM_BLOCK_SIZE] = size;
  u32[idx + MEM_BLOCK_NEXT] = next;
  return block;
}

function unlinkBlock(u32: Uint32Array, prev: number, block: number): void {
  setBlockNext(u32, prev, blockNext(u32, block));
}

function splitBlock(
  stateU32: Uint32Array,
  u32: Uint32Array,
  block: number,
  blockSize: number,
  excess: number
): void {
  insert(
    stateU32,
    u32,
    initBlock(u32, block + setBlockSize(u32, block, blockSize), excess, 0)
  );
  get_doCompact(stateU32) && compact(stateU32, u32);
}

/**
 * Traverses free list and attempts to recursively merge blocks
 * occupying consecutive memory regions. Returns true if any blocks
 * have been merged. Only called if `compact` option is enabled.
 */
function compact(stateU32: Uint32Array, u32: Uint32Array): boolean {
  let block = get__free(stateU32);
  let prev = 0;
  let scan = 0;
  let scanPrev: number;
  let res = false;
  while (block) {
    scanPrev = block;
    scan = blockNext(u32, block);
    while (scan && scanPrev + blockSize(u32, scanPrev) === scan) {
      // console.log("merge:", scan.addr, scan.size);
      scanPrev = scan;
      scan = blockNext(u32, scan);
    }
    if (scanPrev !== block) {
      const newSize = scanPrev - block + blockSize(u32, scanPrev);
      // console.log("merged size:", newSize);
      setBlockSize(u32, block, newSize);
      const next = blockNext(u32, scanPrev);
      let tmp = blockNext(u32, block);
      while (tmp && tmp !== next) {
        // console.log("release:", tmp.addr);
        const tn = blockNext(u32, tmp);
        setBlockNext(u32, tmp, 0);
        tmp = tn;
      }
      setBlockNext(u32, block, next);
      res = true;
    }
    // re-adjust top if poss
    if (block + blockSize(u32, block) >= get_top(stateU32)) {
      set_top(stateU32, block);
      if (prev !== 0) {
        unlinkBlock(u32, prev, block);
      } else {
        set__free(stateU32, blockNext(u32, block));
      }
      // prev
      //     ? this.unlinkBlock(prev, block)
      //     : (this._free = this.blockNext(block));
    }
    prev = block;
    block = blockNext(u32, block);
  }
  return res;
}

/**
 * Inserts given block into list of free blocks, sorted by address.
 *
 * @param block -
 */
function insert(stateU32: Uint32Array, u32: Uint32Array, block: number): void {
  let ptr = get__free(stateU32);
  let prev = 0;
  while (ptr) {
    if (block <= ptr) break;
    prev = ptr;
    ptr = blockNext(u32, ptr);
  }
  if (prev) {
    setBlockNext(u32, prev, block);
  } else {
    set__free(stateU32, block);
  }
  setBlockNext(u32, block, ptr);
}

/**
 * Returns a block's data address, based on given alignment.
 *
 * @param blockAddress -
 */
function blockDataAddress(blockAddress: number): number {
  return blockAddress + SIZEOF_MEM_BLOCK;
}

/**
 * Returns block start address for given data address and alignment.
 *
 * @param dataAddress -
 */
function blockSelfAddress(dataAddress: number): number {
  return dataAddress - SIZEOF_MEM_BLOCK;
}

/**
 * Aligns `addr` to next multiple of `size`. The latter must be a power
 * of 2.
 *
 * @param addr - value to align
 * @param size - alignment value
 */
export function align(addr: number, size: Pow2): number {
  return size--, (addr + size) & ~size;
}
