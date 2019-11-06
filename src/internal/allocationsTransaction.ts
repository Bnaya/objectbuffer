import { IMemPool } from "@bnaya/malloc-temporary-fork";
import { OutOfMemoryError } from "./exceptions";

// extend pool and not monkey patch? need to think about it
export function allocationsTransaction(operation: () => void, pool: IMemPool) {
  const allocations: number[] = [];
  const originalMalloc = pool.malloc;
  const originalCalloc = pool.calloc;
  const originalRealloc = pool.realloc;
  let isInRealloc = false;

  function rollback() {
    for (const block of allocations) {
      pool.free(block);
    }
  }

  pool.realloc = function realloc(ptr: number, size: number) {
    isInRealloc = true;
    const allocation = originalRealloc.call(pool, ptr, size);

    if (allocation === 0) {
      throw new OutOfMemoryError();
    }

    isInRealloc = false;

    return allocation;
  };

  pool.malloc = function malloc(size: number) {
    const allocation = originalMalloc.call(pool, size);

    if (allocation === 0) {
      rollback();
      throw new OutOfMemoryError();
    }

    if (!isInRealloc) {
      allocations.push(allocation);
    }

    return allocation;
  };

  pool.calloc = function calloc(size: number) {
    const allocation = originalCalloc.call(pool, size);

    if (allocation === 0) {
      rollback();
      throw new OutOfMemoryError();
    }

    if (!isInRealloc) {
      allocations.push(allocation);
    }

    return allocation;
  };

  operation();

  pool.malloc = originalMalloc;
  pool.calloc = originalCalloc;
  pool.realloc = originalRealloc;
}
