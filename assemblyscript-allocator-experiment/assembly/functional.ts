type Pow2 = number;

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

// export function allocatorInit(
//   // options: Readonly<MemPoolOpts>
//   size = 0x1000,
//   start = 0,
//   align = 8,
//   end = 0x1000,
//   minSplit = 16,
//   compact = true,
//   split = true
// ): Uint32Array {
//   invariant(align >= 8, "align must be >= 8");
//   invariant(align % 8 === 0, "align must be multiplication of 8");

//   const buf = new ArrayBuffer(size || 0x1000);

//   const state = Uint32Array.wrap(buf, start, SIZEOF_STATE / 4);
//   const u32 = Uint32Array.wrap(buf);

//   const top = initialTop(start, align as Pow2);
//   const resolvedEnd =
//     end != null ? Math.min(end, buf.byteLength) : buf.byteLength;

//   set_align(state, align);
//   set_doCompact(state, compact);
//   set_doSplit(state, split);
//   set_minSplit(state, minSplit);
//   set_end(state, resolvedEnd);
//   set_top(state, top);
//   set__free(state, 0);
//   set__used(state, 0);

//   if (top >= resolvedEnd) {
//     throw new Error(
//       `insufficient address range (0x${start.toString(
//         16
//       )} - 0x${resolvedEnd.toString(16)})`
//     );
//   }

//   return u32;
// }

// export function calloc(
//   state: Uint32Array,
//   u32: Uint32Array,
//   u8: Uint32Array,
//   bytes: number,
//   fill = 0
// ): number {
//   const addr = malloc(state, u32, bytes);
//   addr && u8.fill(fill, addr, addr + bytes);
//   return addr;
// }

export function malloc(
  state: Uint32Array,
  u32: Uint32Array,
  bytes: number
): number {
  if (bytes <= 0) {
    return 0;
  }

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

// export function realloc(
//   state: Uint32Array,
//   u32: Uint32Array,
//   u8: Uint8Array,
//   ptr: number,
//   bytes: number
// ): number {
//   if (bytes <= 0) {
//     return 0;
//   }

//   const oldAddr = blockSelfAddress(ptr);
//   let newAddr = 0;
//   let block = get__used(state);
//   let blockEnd = 0;
//   while (block) {
//     if (block === oldAddr) {
//       const itrBlockSize = blockSize(u32, block);
//       blockEnd = oldAddr + itrBlockSize;
//       const isTop = blockEnd >= get_top(state);
//       const paddedSize = align(bytes + SIZEOF_MEM_BLOCK, get_align(state));
//       // shrink & possibly split existing block
//       if (paddedSize <= itrBlockSize) {
//         if (get_doSplit(state)) {
//           const excess = itrBlockSize - paddedSize;
//           if (excess >= get_minSplit(state)) {
//             splitBlock(state, u32, block, paddedSize, excess);
//           } else if (isTop) {
//             set_top(state, oldAddr + paddedSize);
//             // this.top = oldAddr + paddedSize;
//           }
//         } else if (isTop) {
//           set_top(state, oldAddr + paddedSize);
//           // this.top = oldAddr + paddedSize;
//         }
//         newAddr = oldAddr;
//         break;
//       }
//       // try to enlarge block if current top
//       if (isTop && oldAddr + paddedSize < get_end(state)) {
//         set_top(state, oldAddr + setBlockSize(u32, block, paddedSize));
//         newAddr = oldAddr;
//         break;
//       }
//       // fallback to free & malloc
//       free(state, u32, oldAddr);
//       newAddr = blockSelfAddress(malloc(state, u32, bytes));
//       break;
//     }
//     block = blockNext(u32, block);
//   }
//   // copy old block contents to new addr
//   if (newAddr && newAddr !== oldAddr) {
//     u8.copyWithin(
//       blockDataAddress(newAddr),
//       blockDataAddress(oldAddr),
//       blockEnd
//     );
//   }
//   return blockDataAddress(newAddr);
// }

export function free(
  state: Uint32Array,
  u32: Uint32Array,
  ptr: number
): boolean {
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
      get_doCompact(state) && compact(state, u32);
      return true;
    }
    prev = block;
    block = blockNext(u32, block);
  }
  return false;
}

export function freeAll(state: Uint32Array, start: number): void {
  set__free(state, 0);
  set__used(state, 0);
  set_top(state, initialTop(start, get_align(state) as Pow2));
}

// export function stats(
//   allocatorState: Readonly<AllocatorState>
// ): Readonly<MemPoolStats> {
//   const listStats = (block: number) => {
//     let count = 0;
//     let size = 0;
//     while (block) {
//       count++;
//       size += blockSize(allocatorState.u32, block);
//       block = blockNext(allocatorState.u32, block);
//     }
//     return { count, size };
//   };

//   const free = listStats(get__free(allocatorState.state));
//   return {
//     free,
//     used: listStats(get__used(allocatorState.state)),
//     top: get_top(allocatorState.state),
//     available:
//       get_end(allocatorState.state) - get_top(allocatorState.state) + free.size,
//     total: allocatorState.u8.buffer.byteLength,
//   };
// }

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
