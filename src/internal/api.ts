import { initializeArrayBuffer } from "./store";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { ExternalArgsApi, GlobalCarrier } from "./interfaces";
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
  initializeArrayBuffer(arrayBuffer);

  const allocator = new MemPool({
    align: 8,
    buf: arrayBuffer,
    start: MEM_POOL_START
  });

  const carrier: GlobalCarrier = {
    // dataView,
    allocator,
    uint8: new Uint8Array(arrayBuffer),
    uint16: new Uint16Array(arrayBuffer),
    uint32: new Uint32Array(arrayBuffer),
    float64: new Float64Array(arrayBuffer),
    bigUint64: new BigUint64Array(arrayBuffer)
  };

  const start = objectSaver(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    [],
    initialValue
  );

  carrier.uint32[
    INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
  ] = start;

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
  return getInternalAPI(objectBuffer).getCarrier().uint8.buffer;
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
  // const dataView = new DataView(arrayBuffer);
  const allocator = new MemPool({
    align: 8,
    buf: arrayBuffer,
    start: MEM_POOL_START,
    skipInitialization: true
  });

  const carrier: GlobalCarrier = {
    // dataView,
    allocator,
    uint8: new Uint8Array(arrayBuffer),
    uint16: new Uint16Array(arrayBuffer),
    uint32: new Uint32Array(arrayBuffer),
    float64: new Float64Array(arrayBuffer),
    bigUint64: new BigUint64Array(arrayBuffer)
  };

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    carrier.uint32[
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
    align: 8,
    buf: newArrayBuffer,
    start: MEM_POOL_START,
    skipInitialization: true
  });

  const carrier: GlobalCarrier = {
    // dataView: new DataView(newArrayBuffer),
    allocator,
    uint8: new Uint8Array(newArrayBuffer),
    uint16: new Uint16Array(newArrayBuffer),
    uint32: new Uint32Array(newArrayBuffer),
    float64: new Float64Array(newArrayBuffer),
    bigUint64: new BigUint64Array(newArrayBuffer)
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  allocator.end = newArrayBuffer.byteLength;

  getInternalAPI(objectBuffer).replaceCarrierContent(carrier);
}

export { sizeOf } from "./sizeOf";

/**
 * Return the number of free & used bytes left in the given objectBuffer
 */
export function memoryStats(objectBuffer: any) {
  const buf = getUnderlyingArrayBuffer(objectBuffer);

  const pool = new MemPool({
    align: 8,
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
