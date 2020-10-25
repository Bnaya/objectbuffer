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

/**
 * @deprecated
 */
const MASK_COMPACT = 1;

const MASK_SPLIT = 2;

const SIZEOF_STATE = 7 * 4;

const MEM_BLOCK_SIZE = 0;
const MEM_BLOCK_NEXT = 1;
const MEM_BLOCK_PREV = 2;
const MEM_BLOCK_FLAGS = 3;

const SIZEOF_MEM_BLOCK_HEADER =
  // MEM_BLOCK_SIZE
  4 +
  // MEM_BLOCK_NEXT
  4 +
  // MEM_BLOCK_PREV
  4 +
  // PADDING_OR_PLACEHOLDER
  4;

// eg: 16 + 1 + 7 = 24
const MIN_MIN_SPLIT = align(SIZEOF_MEM_BLOCK_HEADER + 1, 8);

export function allocatorInit(
  options: Readonly<AllocatorInitOpts>,
  useShareArrayBuffer = false
): Readonly<AllocatorState> {
  invariant(options.align >= 8, "align must be >= 8");
  invariant(options.align % 8 === 0, "align must be multiplication of 8");
  invariant(
    options.minSplit >= MIN_MIN_SPLIT,
    `illegal min split threshold: ${options.minSplit}, require at least ${MIN_MIN_SPLIT}`
  );

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

/**
 * For testing purposes
 */
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
      pointer: iteratedBlock + SIZEOF_MEM_BLOCK_HEADER,
      size: readBlockSize(u32, iteratedBlock),
    });

    iteratedBlock = readBlockNext(u32, iteratedBlock);
  }

  return pointers;
}

interface ForTestingBlock {
  blockPointer: number;
  dataPointer: number;
  next: number;
  prev: number;
  size: number;
  dataSize: number;
}

/**
 * For testing purposes
 */
export function listAllocatedBlocks(
  allocatorState: AllocatorState
): ForTestingBlock[] {
  const blocks: ForTestingBlock[] = [];

  const { u32, state } = allocatorState;

  let iteratedBlock = get__used(state);

  while (iteratedBlock !== 0) {
    blocks.push({
      blockPointer: iteratedBlock,
      dataPointer: iteratedBlock + SIZEOF_MEM_BLOCK_HEADER,
      size: readBlockSize(u32, iteratedBlock),
      dataSize: readBlockSize(u32, iteratedBlock) - SIZEOF_MEM_BLOCK_HEADER,
      next: readBlockNext(u32, iteratedBlock),
      prev: readBlockPrev(u32, iteratedBlock),
    });

    iteratedBlock = readBlockNext(u32, iteratedBlock);
  }

  return blocks;
}

/**
 * For testing purposes
 */
export function listFreeBlocks(
  allocatorState: AllocatorState
): ForTestingBlock[] {
  const blocks: ForTestingBlock[] = [];

  const { u32, state } = allocatorState;

  let iteratedBlock = get__free(state);

  while (iteratedBlock !== 0) {
    blocks.push({
      blockPointer: iteratedBlock,
      dataPointer: iteratedBlock + SIZEOF_MEM_BLOCK_HEADER,
      size: readBlockSize(u32, iteratedBlock),
      dataSize: readBlockSize(u32, iteratedBlock) - SIZEOF_MEM_BLOCK_HEADER,
      next: readBlockNext(u32, iteratedBlock),
      prev: readBlockPrev(u32, iteratedBlock),
    });

    iteratedBlock = readBlockNext(u32, iteratedBlock);
  }

  return blocks;
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

  if (addr !== 0) {
    allocatorState.u8.fill(fill, addr, addr + bytes);
  }

  return addr;
}

export function malloc(allocatorState: AllocatorState, bytes: number): number {
  if (bytes <= 0) {
    return 0;
  }

  const state = allocatorState.state;
  const u32 = allocatorState.u32;

  const paddedSize = align(bytes + SIZEOF_MEM_BLOCK_HEADER, get_align(state));
  const end = get_end(state);
  let top = get_top(state);
  let itrBlock = get__free(state);
  let prev = 0;

  // look for suitable pointer in freelist blocks before eating more of the heap/top
  // one day this will be a search tree
  while (itrBlock) {
    const itrBlockSize = readBlockSize(u32, itrBlock);

    // blocks in used list are ordered by address, ascending
    // when we reach to top, means we are in the end of the list
    // the itrBlock is the last block physically before top
    const isTop = itrBlock + itrBlockSize >= top;

    // If we are in top, or the block is in a good size, we can use it
    // if it's top and the block is small, we can enlarge it in-place
    if (isTop || itrBlockSize >= paddedSize) {
      // Check if have enough memory
      if (isTop && itrBlock + paddedSize > end) {
        return 0;
      }

      removeBlockFromList(u32, itrBlock);

      // Block was the first in list
      if (prev === 0) {
        set__free(state, readBlockNext(u32, itrBlock));
      }

      // add block to the beginning of used blocks list
      setBlockPrev(u32, get__used(state), itrBlock);
      setBlockNext(u32, itrBlock, get__used(state));
      setBlockPrev(u32, itrBlock, 0);
      set__used(state, itrBlock);

      // We are the last block, so we can enlarge the block into top
      // Resize-up the block to the requested size
      if (isTop) {
        set_top(state, itrBlock + setBlockSize(u32, itrBlock, paddedSize));
      } else if (get_doSplit(state)) {
        const excess = itrBlockSize - paddedSize;
        if (excess >= get_minSplit(state)) {
          splitBlock(state, u32, itrBlock, excess);
        }
      }

      return blockDataAddress(itrBlock);
    }

    prev = itrBlock;
    itrBlock = readBlockNext(u32, itrBlock);
  }

  // We didn't use any block from the free-list,
  // try to create new block from top
  const newBlock = top;
  top = newBlock + paddedSize;

  if (top <= end) {
    initBlock(u32, newBlock, paddedSize, get__used(state), 0);
    setBlockPrev(u32, get__used(state), newBlock);
    set__used(state, newBlock);
    set_top(state, top);

    return blockDataAddress(newBlock);
  }

  // Out of memory / memory is fragmented, no free block big enough
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
  const { state, u32, u8 } = allocatorState;

  const originalBlockAddr = blockSelfAddress(ptr);
  let maybeNewAddr = 0;
  let blockEnd = 0;

  const newWishedPaddedSize = align(
    bytes + SIZEOF_MEM_BLOCK_HEADER,
    get_align(state)
  );

  const originalBlockSize = readBlockSize(u32, originalBlockAddr);
  blockEnd = originalBlockAddr + originalBlockSize;
  const isTop = blockEnd === get_top(state);

  // no change is needed
  if (newWishedPaddedSize === originalBlockSize) {
    // noop
    maybeNewAddr = originalBlockAddr;
  } else if (
    // The block is the last one before top
    isTop &&
    // we need to shrink
    (newWishedPaddedSize < originalBlockSize ||
      // we need to enlarge and we have enough memory on top for it
      (newWishedPaddedSize > originalBlockSize &&
        originalBlockAddr + newWishedPaddedSize <= get_end(state)))
  ) {
    // very easy, no matter if we need to enlarge or shrink.
    // just change the block size & move top

    set_top(
      state,
      originalBlockAddr +
        setBlockSize(u32, originalBlockAddr, newWishedPaddedSize)
    );
    maybeNewAddr = originalBlockAddr;
  }
  // Smaller size is needed, try to split, or leave it as is
  else if (newWishedPaddedSize < originalBlockSize) {
    const excess = originalBlockSize - newWishedPaddedSize;
    if (get_doSplit(state) && excess >= get_minSplit(state)) {
      splitBlock(state, u32, originalBlockAddr, excess);
    } else {
      // here we just stay with the same block size
      // noop
    }
    maybeNewAddr = originalBlockAddr;
  } else {
    // fallback to free & malloc
    const newAllocatedBlock = malloc(allocatorState, bytes);
    if (newAllocatedBlock === 0) {
      // OOM :(
      // short circuit return
      return 0;
    } else {
      maybeNewAddr = blockSelfAddress(newAllocatedBlock);
      u8.copyWithin(
        blockDataAddress(maybeNewAddr),
        blockDataAddress(originalBlockAddr),
        blockEnd
      );

      // Free only after the data copy
      free(allocatorState, blockDataAddress(originalBlockAddr));
    }
  }

  return blockDataAddress(maybeNewAddr);
}

export function free(
  allocatorState: AllocatorState,
  blockDataSpacePtr: number
): boolean {
  const state = allocatorState.state;
  const u32 = allocatorState.u32;

  const blockToFree = blockSelfAddress(blockDataSpacePtr);
  const firstUsedBlock = get__used(state);

  const next = readBlockNext(u32, blockToFree);
  const prev = readBlockPrev(u32, blockToFree);

  // This block is the first one in the used-list
  if (blockToFree === firstUsedBlock) {
    set__used(state, next);
    if (next !== 0) {
      setBlockPrev(u32, next, 0);
    }
  } else {
    if (prev !== 0) {
      setBlockNext(u32, prev, next);
    }
    if (next !== 0) {
      setBlockPrev(u32, next, prev);
    }
  }

  tryToMergeWithOtherFreeBlocksMeldToTopInsertToFreeList(
    state,
    u32,
    blockToFree
  );

  return true;
}

function isBlockConsecutivePrev(
  u32: Uint32Array,
  blockToCheck: number,
  prevBlock: number
): boolean {
  return prevBlock + readBlockSize(u32, prevBlock) === blockToCheck;
}

function isBlockConsecutiveNext(
  u32: Uint32Array,
  blockToCheck: number,
  nextBlock: number
): boolean {
  return blockToCheck + readBlockSize(u32, blockToCheck) === nextBlock;
}

function isBlockConsecutiveTop(
  u32: Uint32Array,
  blockToCheck: number,
  top: number
) {
  return blockToCheck + readBlockSize(u32, blockToCheck) === top;
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
      size += readBlockSize(allocatorState.u32, block);
      block = readBlockNext(allocatorState.u32, block);
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
  state[STATE_MIN_SPLIT] = x;
}

function initialTop(start: number, _align: Pow2): number {
  return (
    align(start + SIZEOF_STATE + SIZEOF_MEM_BLOCK_HEADER, _align) -
    SIZEOF_MEM_BLOCK_HEADER
  );
}

/**
 * Exported for testing proposes only
 * @private
 * @param state
 * @param u32
 * @param block
 */
export function readBlockSize(u32: Uint32Array, block: number): number {
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
export function readBlockNext(u32: Uint32Array, block: number): number {
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
 * Exported for testing proposes only
 * @private
 * @param u32
 * @param block
 */
export function readBlockPrev(u32: Uint32Array, block: number): number {
  return u32[(block >> 2) + MEM_BLOCK_PREV];
}

/**
 * Sets block next pointer to `next`. Use zero to indicate list end.
 *
 * @param block -
 */
function setBlockPrev(u32: Uint32Array, block: number, prev: number): void {
  u32[(block >> 2) + MEM_BLOCK_PREV] = prev;
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
  next: number,
  prev: number
): number {
  const idx = block >>> 2;
  u32[idx + MEM_BLOCK_SIZE] = size;
  u32[idx + MEM_BLOCK_NEXT] = next;
  u32[idx + MEM_BLOCK_PREV] = prev;
  u32[idx + MEM_BLOCK_FLAGS] = 0;

  return block;
}

function removeBlockFromList(u32: Uint32Array, block: number): void {
  const prev = readBlockPrev(u32, block);
  const next = readBlockNext(u32, block);
  if (prev !== 0) {
    setBlockNext(u32, prev, next);
  }

  if (next !== 0) {
    setBlockPrev(u32, next, prev);
  }
}

function splitBlock(
  stateU32: Uint32Array,
  u32: Uint32Array,
  blockToSplitFrom: number,
  howMuchToSplitIntoNewBlock: number
): void {
  const blockSizeAfterSplit =
    readBlockSize(u32, blockToSplitFrom) - howMuchToSplitIntoNewBlock;
  const splittedBlockPtr = blockToSplitFrom + blockSizeAfterSplit;

  setBlockSize(u32, blockToSplitFrom, blockSizeAfterSplit);

  initBlock(u32, splittedBlockPtr, howMuchToSplitIntoNewBlock, 0, 0);

  // revisit: we may simply insert this block, do need to the whole afterRemovedFromUsedListFindBetterName
  // As we are sure it's not going to merge/meld it because it's a split
  tryToMergeWithOtherFreeBlocksMeldToTopInsertToFreeList(
    stateU32,
    u32,
    splittedBlockPtr
  );
}

function tryToMergeWithOtherFreeBlocksMeldToTopInsertToFreeList(
  stateU32: Uint32Array,
  u32: Uint32Array,
  blockThatIsNowFree: number
) {
  let nextBlockItr = get__free(stateU32);
  let prev = 0;

  // We don't want to mutate blockThatIsNowFree
  let blockNowFreeMaybeMergedWithPrev = blockThatIsNowFree;

  // find possible before & after blocks
  while (nextBlockItr) {
    if (blockNowFreeMaybeMergedWithPrev <= nextBlockItr) {
      break;
    }

    prev = nextBlockItr;
    nextBlockItr = readBlockNext(u32, nextBlockItr);
  }

  // first, we try to insert the block and merge it with prev if applicable
  if (prev !== 0) {
    if (isBlockConsecutivePrev(u32, blockNowFreeMaybeMergedWithPrev, prev)) {
      // merge current block and the prev block
      setBlockSize(
        u32,
        prev,
        readBlockSize(u32, prev) +
          readBlockSize(u32, blockNowFreeMaybeMergedWithPrev)
      );

      blockNowFreeMaybeMergedWithPrev = prev;
    } else {
      // insert block. nextBlockItr may be zero!
      setBlockNext(u32, prev, blockNowFreeMaybeMergedWithPrev);
      if (nextBlockItr !== 0) {
        setBlockPrev(u32, nextBlockItr, blockNowFreeMaybeMergedWithPrev);
      }

      setBlockNext(u32, blockNowFreeMaybeMergedWithPrev, nextBlockItr);
      setBlockPrev(u32, blockNowFreeMaybeMergedWithPrev, prev);
    }
  } else {
    // prev is 0, insert at the beginning of free-list. nextBlockItr may be zero!
    if (nextBlockItr !== 0) {
      setBlockPrev(u32, nextBlockItr, blockNowFreeMaybeMergedWithPrev);
    }

    set__free(stateU32, blockNowFreeMaybeMergedWithPrev);

    setBlockNext(u32, blockNowFreeMaybeMergedWithPrev, nextBlockItr);

    // prev = 0
    setBlockPrev(u32, blockNowFreeMaybeMergedWithPrev, 0);
  }

  // now let's see if we can meld into top
  if (
    isBlockConsecutiveTop(
      u32,
      blockNowFreeMaybeMergedWithPrev,
      get_top(stateU32)
    )
  ) {
    // may be 0!
    const theNewLastBlockInList = readBlockPrev(
      u32,
      blockNowFreeMaybeMergedWithPrev
    );

    set_top(stateU32, blockNowFreeMaybeMergedWithPrev);

    if (theNewLastBlockInList === 0) {
      set__free(stateU32, 0);
    } else {
      setBlockNext(u32, theNewLastBlockInList, 0);
    }
  }
  // Then we try to merge with next
  else if (
    nextBlockItr !== 0 &&
    isBlockConsecutiveNext(u32, blockNowFreeMaybeMergedWithPrev, nextBlockItr)
  ) {
    // may be zero, but it's ok!
    const nextOfNext = readBlockNext(u32, nextBlockItr);

    setBlockSize(
      u32,
      blockNowFreeMaybeMergedWithPrev,
      readBlockSize(u32, blockNowFreeMaybeMergedWithPrev) +
        readBlockSize(u32, nextBlockItr)
    );

    if (nextOfNext !== 0) {
      setBlockPrev(u32, nextOfNext, blockNowFreeMaybeMergedWithPrev);
    }
    setBlockNext(u32, blockNowFreeMaybeMergedWithPrev, nextOfNext);
  }
}

/**
 * Returns a block's data address, based on given alignment.
 *
 * @param blockAddress -
 */
function blockDataAddress(blockAddress: number): number {
  return blockAddress + SIZEOF_MEM_BLOCK_HEADER;
}

/**
 * Returns block start address for given data address and alignment.
 *
 * @param dataAddress -
 */
function blockSelfAddress(dataAddress: number): number {
  return dataAddress - SIZEOF_MEM_BLOCK_HEADER;
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
