import { initializeArrayBuffer, incrementRefCount } from "./store";
import { createObjectWrapper } from "./objectWrapper";
import { ExternalArgsApi, GlobalCarrier, MemoryStats } from "./interfaces";
import {
  arrayBufferCopyTo,
  externalArgsApiToExternalArgsApi,
  getInternalAPI,
  isSupportedTopLevelValue,
} from "./utils";
import { getCacheFor } from "./externalObjectsCache";
import { INITIAL_ENTRY_POINTER_TO_POINTER, MEM_POOL_START } from "./consts";
import { MemPool } from "@thi.ng/malloc";
import { UnsupportedOperationError } from "./exceptions";
import { createHeap } from "../structsGenerator/consts";
import { saveValueIterative } from "./saveValue";
import { allocationsTransaction } from "./allocationsTransaction";

export interface CreateObjectBufferOptions {
  /**
   *  Use SharedArrayBuffer and not regular ArrayBuffer
   *
   *  See browser support:
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility
   */
  useSharedArrayBuffer?: boolean;
}

/**
 * Create a new objectBuffer, with the given initial value
 *
 * the initial value has to be an object.
 */
export function createObjectBuffer<T = any>(
  externalArgs: ExternalArgsApi,
  size: number,
  initialValue: T,
  options: CreateObjectBufferOptions = {}
): T {
  if (!isSupportedTopLevelValue(initialValue)) {
    throw new UnsupportedOperationError();
  }

  const arrayBuffer = new (options.useSharedArrayBuffer
    ? SharedArrayBuffer
    : ArrayBuffer)(size);
  initializeArrayBuffer(arrayBuffer);

  const allocator = new MemPool({
    align: 8,
    buf: arrayBuffer,
    start: MEM_POOL_START,
  });

  const carrier: GlobalCarrier = {
    allocator,
    heap: createHeap(arrayBuffer),
  };

  const referencedPointers: number[] = [];

  allocationsTransaction(() => {
    saveValueIterative(
      externalArgsApiToExternalArgsApi(externalArgs),
      carrier,
      referencedPointers,
      INITIAL_ENTRY_POINTER_TO_POINTER,
      initialValue
    );
  }, allocator);

  for (const pointer of referencedPointers) {
    incrementRefCount(carrier.heap, pointer);
  }

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    carrier.heap.Uint32Array[
      INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
    ]
  );
}

/**
 * Grow or shrink the underlying ArrayBuffer
 *
 * @param objectBuffer
 * @param newSize
 */
export function resizeObjectBuffer(objectBuffer: unknown, newSize: number) {
  const oldArrayBuffer = getUnderlyingArrayBuffer(objectBuffer);
  const newArrayBuffer = new ArrayBuffer(newSize);

  arrayBufferCopyTo(
    oldArrayBuffer,
    0,
    Math.min(newSize, oldArrayBuffer.byteLength),
    newArrayBuffer,
    0
  );

  replaceUnderlyingArrayBuffer(objectBuffer, newArrayBuffer);

  return newArrayBuffer;
}

export function getUnderlyingArrayBuffer(
  objectBuffer: unknown
): ArrayBuffer | SharedArrayBuffer {
  return getInternalAPI(objectBuffer).getCarrier().heap.Uint8Array.buffer;
}

/**
 * Create objectBuffer object from the given ArrayBuffer
 *
 * The given ArrayBuffer is expected to be one obtained via getUnderlyingArrayBuffer
 * This operation doesn't change any value in the ArrayBuffer
 *
 * @param externalArgs
 * @param arrayBuffer
 */
export function loadObjectBuffer<T = any>(
  externalArgs: ExternalArgsApi,
  arrayBuffer: ArrayBuffer | SharedArrayBuffer
): T {
  const allocator = new MemPool({
    align: 8,
    buf: arrayBuffer,
    start: MEM_POOL_START,
    skipInitialization: true,
  });

  const carrier: GlobalCarrier = {
    allocator,
    heap: createHeap(arrayBuffer),
  };

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    carrier.heap.Uint32Array[
      INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
    ]
  );
}

/**
 * Replace the Underlying array buffer with the given one.
 * The given ArrayBuffer is expected to be a copy of the prev ArrayBuffer,
 * just bigger or smaller (less free space)
 *
 * Consider using `resizeObjectBuffer`
 *
 * @param objectBuffer
 * @param newArrayBuffer
 */
export function replaceUnderlyingArrayBuffer(
  objectBuffer: unknown,
  newArrayBuffer: ArrayBuffer | SharedArrayBuffer
) {
  const oldArrayBuffer = getUnderlyingArrayBuffer(objectBuffer);

  const oldCache = getCacheFor(oldArrayBuffer);
  const newCache = getCacheFor(newArrayBuffer);

  for (const entry of oldCache) {
    newCache.set(entry[0], entry[1]);
    oldCache.delete(entry[0]);
  }

  const allocator = new MemPool({
    align: 8,
    buf: newArrayBuffer,
    start: MEM_POOL_START,
    skipInitialization: true,
  });

  const carrier: GlobalCarrier = {
    allocator,
    heap: createHeap(newArrayBuffer),
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  allocator.end = newArrayBuffer.byteLength;

  getInternalAPI(objectBuffer).replaceCarrierContent(carrier);
}

/**
 * Return the number of free & used bytes left in the given objectBuffer
 */
export function memoryStats(objectBuffer: unknown): MemoryStats {
  const buf = getUnderlyingArrayBuffer(objectBuffer);

  const pool = new MemPool({
    align: 8,
    buf,
    skipInitialization: true,
    start: MEM_POOL_START,
  });

  const { available, total, top } = pool.stats();

  return { available, used: total - available, total, top };
}

export { disposeWrapperObject } from "./disposeWrapperObject";

/**
 * Allows to update external args passed to createObjectBuffer
 */
export function updateExternalArgs(
  objectBuffer: unknown,
  options: Partial<ExternalArgsApi>
) {
  Object.assign(getInternalAPI(objectBuffer).getExternalArgs(), options);
}
