import { IMemPool, MemPool } from "@thi.ng/malloc";
import { OutOfMemoryError } from "./exceptions";
import { GlobalCarrier } from "./interfaces";
import { MEM_POOL_START } from "./consts";
import { createHeap } from "../structsGenerator/consts";
import { getInternalAPI } from "./utils";
import { memoryStats } from "./api";

export function getArrayBufferOnTopSize(ob: unknown) {
  const stats = memoryStats(ob);
  const carrier = getInternalAPI(ob).getCarrier();
  return carrier.heap.Uint8Array.slice(0, stats.top);
}

export function makeAllocatorThrowOnOOM(allocator: IMemPool) {
  const origMalloc = allocator.malloc;
  allocator.malloc = function wrappedMalloc(memSize) {
    if (memSize === 0) {
      throw new Error("memSize can't be 0");
    }

    const allocated = origMalloc.call(allocator, memSize);
    if (allocated === 0) {
      throw new Error("OOM memSize");
    }

    return allocated;
  };
}

export function makeThrowOnOOM(ob: unknown) {
  const allocator = getInternalAPI(ob).getCarrier().allocator;

  makeAllocatorThrowOnOOM(allocator);
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

export function wait(time: number) {
  return new Promise((res) => {
    // eslint-disable-next-line no-undef
    setTimeout(res, time);
  });
}

// extend pool and not monkey patch? need to think about it
export function recordAllocations(operation: () => void, pool: IMemPool) {
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

export function makeCarrier(arrayBuffer: ArrayBuffer) {
  const allocator = new MemPool({
    buf: arrayBuffer,
    start: MEM_POOL_START,
  });

  const carrier: GlobalCarrier = {
    allocator,
    heap: createHeap(arrayBuffer),
  };

  return carrier;
}
