/* istanbul ignore file */

import { OutOfMemoryError } from "./exceptions";
import { GlobalCarrier } from "./interfaces";
import { createHeap } from "../structsGenerator/consts";
import { getInternalAPI } from "./utils";
import { memoryStats } from "./api";
import {
  FunctionalAllocatorWrapper,
  TransactionalAllocator,
} from "./TransactionalAllocator";

export function getArrayBufferOnTopSize(ob: unknown) {
  const stats = memoryStats(ob);
  const carrier = getInternalAPI(ob).getCarrier();
  return carrier.heap.u8.slice(0, stats.top);
}

export function arrayBuffer2HexArray(
  buffer: ArrayBuffer,
  withByteNumber = false
) {
  if (withByteNumber) {
    return Array.prototype.map.call(
      new Uint8Array(buffer),
      (x: number, index) => `${index}:${x.toString(16).padStart(4, "0x")}`
    );
  }
  return Array.prototype.map.call(new Uint8Array(buffer), (x: number) =>
    x.toString(16).padStart(4, "0x")
  );
}

// extend pool and not monkey patch? need to think about it
export function recordAllocations(
  operation: () => void,
  pool: FunctionalAllocatorWrapper
) {
  const allocations = new Set<number>();
  const deallocations = new Set<number>();

  const originalMalloc = pool.malloc;
  const originalCalloc = pool.calloc;
  const originalRealloc = pool.realloc;
  const originalFree = pool.free;
  let isInReallocOrCalloc = false;

  pool.realloc = function realloc(ptr: number, size: number) {
    isInReallocOrCalloc = true;
    const allocation = originalRealloc.call(pool, ptr, size);

    if (allocation === 0) {
      throw new OutOfMemoryError();
    }

    isInReallocOrCalloc = false;

    return allocation;
  };

  pool.malloc = function malloc(size: number) {
    const allocation = originalMalloc.call(pool, size);

    if (allocation === 0) {
      throw new OutOfMemoryError();
    }

    if (!isInReallocOrCalloc) {
      allocations.add(allocation);
    }

    return allocation;
  };

  pool.calloc = function calloc(size: number) {
    isInReallocOrCalloc = true;
    const allocation = originalCalloc.call(pool, size);

    if (allocation === 0) {
      throw new OutOfMemoryError();
    }

    allocations.add(allocation);

    isInReallocOrCalloc = false;
    return allocation;
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  pool.free = function free(ptr: number) {
    deallocations.add(ptr);
    allocations.delete(ptr);
    originalFree.call(this, ptr);
  };

  operation();

  pool.malloc = originalMalloc;
  pool.calloc = originalCalloc;
  pool.realloc = originalRealloc;
  pool.free = originalFree;

  return { allocations: [...allocations], deallocations: [...deallocations] };
}

export function makeCarrier(size: number) {
  const allocator = new TransactionalAllocator({
    size,
  });

  const carrier: GlobalCarrier = {
    allocator,
    heap: createHeap(allocator.getArrayBuffer()),
  };

  return carrier;
}

export function sleep(ms: number) {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}
