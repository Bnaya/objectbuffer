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
  return new Promise(res => {
    // eslint-disable-next-line no-undef
    setTimeout(res, time);
  });
}

import { IMemPool, MemPool } from "@thi.ng/malloc";
import { OutOfMemoryError } from "./exceptions";
import { GlobalCarrier } from "./interfaces";
import { MEM_POOL_START } from "./consts";

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
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
    start: MEM_POOL_START
  });

  const carrier: GlobalCarrier = {
    // dataView: new DataView(arrayBuffer),
    allocator,
    uint8: new Uint8Array(arrayBuffer),
    uint16: new Uint16Array(arrayBuffer),
    uint32: new Uint32Array(arrayBuffer),
    float64: new Float64Array(arrayBuffer),
    bigUint64: new BigUint64Array(arrayBuffer)
  };

  return carrier;
}
