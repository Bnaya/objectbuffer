import { initializeArrayBuffer } from "./store";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { INTERNAL_API_SYMBOL, REPLACE_DATA_VIEW_SYMBOL } from "./symbols";
import { InternalAPI, ExternalArgsApi } from "./interfaces";
import {
  arrayBufferCopyTo,
  getFirstFreeByte,
  externalArgsApiToExternalArgsApi
} from "./utils";
import { getCacheFor } from "./externalObjectsCache";
import { INITIAL_ENTRY_POINTER_TO_POINTER } from "./consts";

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

  const { start } = objectSaver(
    externalArgsApiToExternalArgsApi(externalArgs),
    dataView,
    initialValue
  );

  dataView.setUint32(INITIAL_ENTRY_POINTER_TO_POINTER, start);

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    { dataView },
    start,
    true
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
  return (objectBuffer[INTERNAL_API_SYMBOL] as InternalAPI).getDataView()
    .buffer;
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

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    { dataView },
    dataView.getUint32(INITIAL_ENTRY_POINTER_TO_POINTER),
    true
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

  objectBuffer[REPLACE_DATA_VIEW_SYMBOL](new DataView(newArrayBuffer));
}

export { sizeOf } from "./sizeOf";

/**
 * Return the number of free bytes left in the given objectBuffer
 * @param objectBuffer
 */
export function spaceLeft(objectBuffer: any) {
  const ab = getUnderlyingArrayBuffer(objectBuffer);

  return ab.byteLength - getFirstFreeByte(ab);
}
