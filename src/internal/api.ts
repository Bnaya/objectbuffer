import { initializeArrayBuffer } from "./store";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { ExternalArgsApi } from "./interfaces";
import {
  arrayBufferCopyTo,
  externalArgsApiToExternalArgsApi,
  getInternalAPI
} from "./utils";
import { getCacheFor } from "./externalObjectsCache";
import { INITIAL_ENTRY_POINTER_TO_POINTER, MEM_POOL_START } from "./consts";
import { MemPool } from "@thi.ng/malloc";

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
  const arrayBuffer = new (options.useSharedArrayBuffer
    ? SharedArrayBuffer
    : ArrayBuffer)(size);
  const dataView = initializeArrayBuffer(arrayBuffer);

  const allocator = new MemPool({
    buf: arrayBuffer,
    start: MEM_POOL_START
  });

  const carrier = { dataView, allocator };

  const start = objectSaver(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    [],
    initialValue
  );

  dataView.setUint32(INITIAL_ENTRY_POINTER_TO_POINTER, start);

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    start
  );
}

/**
 * Grow or shrink the underlying ArrayBuffer
 *
 * @param objectBuffer
 * @param newSize
 */
export function resizeObjectBuffer(objectBuffer: any, newSize: number) {
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
  objectBuffer: any
): ArrayBuffer | SharedArrayBuffer {
  return getInternalAPI(objectBuffer).getCarrier().dataView.buffer;
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
  const dataView = new DataView(arrayBuffer);
  const allocator = new MemPool({
    buf: arrayBuffer,
    start: MEM_POOL_START,
    skipInitialization: true
  });

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    { dataView, allocator },
    dataView.getUint32(INITIAL_ENTRY_POINTER_TO_POINTER)
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
  objectBuffer: any,
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
    buf: newArrayBuffer,
    start: MEM_POOL_START,
    skipInitialization: true
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  allocator.end = newArrayBuffer.byteLength;

  getInternalAPI(objectBuffer).replaceCarrierContent(
    new DataView(newArrayBuffer),
    allocator
  );
}

export { sizeOf } from "./sizeOf";

/**
 * Return the number of free & used bytes left in the given objectBuffer
 */
export function memoryStats(objectBuffer: any) {
  const buf = getUnderlyingArrayBuffer(objectBuffer);

  const pool = new MemPool({
    buf,
    skipInitialization: true,
    start: MEM_POOL_START
  });

  const { available, total } = pool.stats();

  return { available, used: total - available };
}

export { disposeWrapperObject } from "./disposeWrapperObject";

/**
 * Allows to update external args passed to createObjectBuffer
 */
export function updateExternalArgs(
  objectBuffer: any,
  options: Partial<ExternalArgsApi>
) {
  Object.assign(getInternalAPI(objectBuffer).getExternalArgs(), options);
}
