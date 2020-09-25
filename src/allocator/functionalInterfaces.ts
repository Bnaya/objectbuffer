import type { Heap } from "../structsGenerator/consts";

export type Pow2 =
  | 0x1
  | 0x2
  | 0x4
  | 0x8
  | 0x10
  | 0x20
  | 0x40
  | 0x80
  | 0x100
  | 0x200
  | 0x400
  | 0x800
  | 0x1000
  | 0x2000
  | 0x4000
  | 0x8000
  | 0x10000
  | 0x20000
  | 0x40000
  | 0x80000
  | 0x100000
  | 0x200000
  | 0x400000
  | 0x800000
  | 0x1000000
  | 0x2000000
  | 0x4000000
  | 0x8000000
  | 0x10000000
  | 0x20000000
  | 0x40000000
  | 0x80000000;

export interface AllocatorState extends Heap {
  options: Readonly<AllocatorInitOpts>;
  state: Uint32Array;
}
export interface AllocatorInitOpts {
  /**
   * Byte size for newly created ArrayBuffers (if `buf` is not given).
   *
   * @defaultValue 0x1000 (4KB)
   */
  size: number;
  /**
   * Anchor index (byte address) inside the array buffer. The MemPool
   * stores its internal state from the given address and heap space
   * starts at least 32 bytes later (depending on chosen `align`
   * value). Unlike allocator state variables, `start`` cannot be
   * saved inside the array buffer itself. If the ArrayBuffer is
   * passed to other consumers they must use the same start value.
   * MUST be multiple of 4.
   *
   * @defaultValue 0
   */
  start: number;
  /**
   * Byte address (+1) of the end of the memory region managed by the
   * {@link MemPool}.
   *
   * @defaultValue end of the backing ArrayBuffer
   */
  end: number;
  /**
   * Number of bytes to align memory blocks to. MUST be a power of 2
   * and >= 8. Use 16 if the pool is being used for allocating memory
   * used in SIMD operations.
   *
   * @defaultValue 8
   */
  align: Pow2;
  /**
   * Flag to configure memory block compaction. If true,
   * adjoining free blocks (in terms of address space) will be merged
   * to minimize fragementation.
   *
   * @defaultValue true
   */
  compact: boolean;
  /**
   * Flag to configure memory block splitting. If true, and when the
   * allocator is re-using a previously freed block larger than the
   * requested size, the block will be split to minimize wasted/unused
   * memory. The splitting behavior can further customized via the
   * `minSplit` option.
   *
   * @defaultValue true
   */
  split: boolean;
  /**
   * Only used if `split` behavior is enabled. Defines min number of
   * excess bytes available in a block for memory block splitting to
   * occur.
   *
   * @defaultValue 16, MUST be > 8
   */
  minSplit: number;
}

interface CountAndSize {
  count: number;
  size: number;
}

export interface AllocatorStats {
  /**
   * Free block stats.
   */
  free: CountAndSize;
  /**
   * Used block stats.
   */
  used: CountAndSize;
  /**
   * Current top address.
   */
  top: number;
  /**
   * Bytes available
   */
  available: number;
  /**
   * Total pool size.
   */
  total: number;
}
