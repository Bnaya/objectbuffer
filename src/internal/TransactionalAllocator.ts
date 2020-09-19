import { MEM_POOL_START } from "../internal/consts";
import { OutOfMemoryError } from "./exceptions";
import {
  AllocatorInitOpts,
  AllocatorState,
  AllocatorStats,
  stats,
} from "../allocator/allocator";
import {
  allocatorInit,
  realloc,
  malloc,
  calloc,
  free,
  freeAll,
} from "../allocator/allocator";
import { loadAllocator, setEnd } from "../allocator/functional";

export class TransactionalAllocator implements FunctionalAllocatorWrapper {
  protected inTransaction: boolean;
  protected transactionAddresses: number[];
  protected allocatorState: AllocatorState;

  static load(ab: ArrayBuffer | SharedArrayBuffer) {
    const state = loadAllocator(ab, MEM_POOL_START);

    return new TransactionalAllocator(state);
  }

  constructor(
    optsOrState: Partial<AllocatorInitOpts> | AllocatorState,
    useSharedArrayBuffer = false
  ) {
    if ("u8" in optsOrState) {
      this.allocatorState = optsOrState;
    } else {
      this.allocatorState = allocatorInit(
        {
          size: 0x1000,
          start: MEM_POOL_START,
          end: optsOrState.end ?? optsOrState.size ?? 0x1000,
          align: 8,
          compact: true,
          split: true,
          minSplit: 16,
          ...optsOrState,
        },
        useSharedArrayBuffer
      );
    }

    this.inTransaction = false;
    this.transactionAddresses = [];
  }

  getArrayBuffer(): ArrayBuffer | SharedArrayBuffer {
    return this.allocatorState.u32.buffer;
  }

  calloc(bytes: number, fill?: number): number {
    if (bytes === 0) {
      return 0;
    }

    const address = calloc(this.allocatorState, bytes, fill);

    if (address === 0) {
      if (this.transactionAddresses.length > 0) {
        for (const block of this.transactionAddresses) {
          this.free(block);
        }
      }

      this.endTransaction();

      throw new OutOfMemoryError();
    }

    this.transactionAddresses.push(address);

    return address;
  }

  realloc(ptr: number, size: number): number {
    if (size === 0) {
      return 0;
    }

    const address = realloc(this.allocatorState, ptr, size);

    if (address === 0) {
      if (this.transactionAddresses.length > 0) {
        for (const block of this.transactionAddresses) {
          this.free(block);
        }
      }

      this.endTransaction();

      throw new OutOfMemoryError();
    }

    if (address !== ptr) {
      this.transactionAddresses.push(address);
    }

    return address;
  }

  free(ptr: number): boolean {
    // if (this.inTransaction) {
    //   throw new Error("invariant: Free during transaction is not expected");
    // }
    return free(this.allocatorState, ptr);
  }

  freeAll(): void {
    freeAll(this.allocatorState);
  }

  stats(): Readonly<AllocatorStats> {
    return stats(this.allocatorState);
  }

  public setNewEnd(newEnd: number) {
    setEnd(this.allocatorState, newEnd);
  }

  public malloc(bytes: number): number {
    if (bytes === 0) {
      return 0;
    }

    const address = malloc(this.allocatorState, bytes);

    if (address === 0) {
      if (this.transactionAddresses.length > 0) {
        for (const block of this.transactionAddresses) {
          this.free(block);
        }
      }

      this.endTransaction();

      throw new OutOfMemoryError();
    }

    this.transactionAddresses.push(address);

    return address;
  }

  public transaction<T>(cmd: () => T) {
    this.startTransaction();
    try {
      return cmd();
    } finally {
      this.endTransaction();
    }
  }

  protected startTransaction() {
    this.inTransaction = true;
  }

  protected endTransaction() {
    this.inTransaction = false;
    this.transactionAddresses = [];
  }
}

export interface FunctionalAllocatorWrapper {
  /**
   * Attempts to allocate a new memory block of given `size` (in
   * bytes). Returns block address or zero if unsuccessful
   * (insufficient memory).
   *
   * @param size -
   */
  malloc(size: number): number;
  /**
   * Similar to {@link IMemPool.malloc}, but if allocation was successful also
   * clears the allocated block w/ `fill` value (default: 0).
   *
   * @param size -
   * @param fill -
   */
  calloc(size: number, fill?: number): number;

  /**
   * Attempts to reallocate given memory block to new `size` (in
   * bytes). If new `size` is larger than the original, attempts to
   * grow block or else allocates new one and moves contents to new
   * address. If new size is smaller than original, the existing block
   * might be split (depending on `split` & `minSplit` config options)
   * and the unused part freed. Returns new address if successful or
   * zero if re-allocation failed (insufficient menory).
   *
   * @param ptr -
   * @param size -
   */
  realloc(ptr: number, size: number): number;

  /**
   * Takes a memory block address and attempts to return the block to
   * the pool. Depending on `compact` config option, this operation
   * might cause compaction of consecutive free memory blocks to help
   * counter fragmentation. Returns true if block has been freed.
   *
   * It's the user's responsibility to ensure that freed blocks are
   * not used any further after calling {@link IMemPool.free}.
   * Undefined behavior, or worse, pool corruption might ensue!
   *
   * @param ptr -
   */
  free(ptr: number): boolean;
  /**
   * Frees all previously allocated blocks and resests allocator state.
   */
  freeAll(): void;
  /**
   * Returns an information object of the pool's state.
   */
  stats(): Readonly<AllocatorStats>;

  getArrayBuffer(): ArrayBuffer | SharedArrayBuffer;
}
//# sourceMappingURL=api.d.ts.map
