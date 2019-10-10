import { initializeArrayBuffer } from "./store";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import {
  GET_UNDERLYING_ARRAY_BUFFER_SYMBOL,
  REPLACE_DATA_VIEW_SYMBOL
} from "./symbols";
import { ExternalArgs } from "./interfaces";
import { arrayBufferCopyTo, getFirstFreeByte } from "./utils";
import { getCacheFor } from "./externalObjectsCache";
import { TextDecoder, TextEncoder } from "./textEncoderDecoderTypes";

export function createObjectBuffer<T = any>(
  externalArgs: ExternalArgsApi,
  size: number,
  initialValue: T,
  { useSharedArrayBuffer }: { useSharedArrayBuffer?: boolean } = {
    useSharedArrayBuffer: false
  }
): T {
  const arrayBuffer = new (useSharedArrayBuffer
    ? SharedArrayBuffer
    : ArrayBuffer)(size);
  const dataView = initializeArrayBuffer(arrayBuffer);

  const { start } = objectSaver(
    externalArgsApiToExternalArgsApi(externalArgs),
    dataView,
    initialValue
  );

  dataView.setUint32(16, start);

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    { dataView },
    start,
    true
  );
}

export function getUnderlyingArrayBuffer(
  objectBuffer: any
): ArrayBuffer | SharedArrayBuffer {
  return objectBuffer[GET_UNDERLYING_ARRAY_BUFFER_SYMBOL];
}

export function createObjectBufferFromArrayBuffer<T = any>(
  externalArgs: ExternalArgsApi,
  arrayBuffer: ArrayBuffer | SharedArrayBuffer,
  // set to true if the give array buffer is not one from `getUnderlyingArrayBuffer`
  shouldInitializeArrayBuffer = false
): T {
  const dataView = shouldInitializeArrayBuffer
    ? initializeArrayBuffer(arrayBuffer)
    : new DataView(arrayBuffer);

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    { dataView },
    dataView.getUint32(16),
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

/**
 * Replace the Underlying array buffer with the given one.
 * The given ArrayBuffer is expected to be a copy of the prev ArrayBuffer,
 * just bigger, or smaller (less free space)
 * See `resizeObjectBuffer`
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

export type ExternalArgsApi = Readonly<{
  arrayAdditionalAllocation?: number;
  minimumStringAllocation?: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

function externalArgsApiToExternalArgsApi(p: ExternalArgsApi): ExternalArgs {
  return {
    ...p,
    arrayAdditionalAllocation: p.arrayAdditionalAllocation
      ? p.arrayAdditionalAllocation
      : 0,
    minimumStringAllocation: p.minimumStringAllocation
      ? p.minimumStringAllocation
      : 0
  };
}

export { sizeOf } from "./sizeOf";

/**
 * Return the number of free bytes left
 * @param objectBuffer
 */
export function spaceLeft(objectBuffer: any) {
  const ab = getUnderlyingArrayBuffer(objectBuffer);

  return ab.byteLength - getFirstFreeByte(ab);
}
