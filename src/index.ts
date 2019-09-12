import { initializeArrayBuffer } from "./internal/store";
import { objectSaver } from "./internal/objectSaver";
import {
  createObjectWrapper,
  GET_UNDERLYING_ARRAY_BUFFER_SYMBOL
} from "./internal/objectWrapper";

export function createObjectBuffer<T = any>(
  textDecoder: any,
  textEncoder: any,
  size: number,
  initialValue: T
): T {
  const arrayBuffer = new ArrayBuffer(size);
  const dataView = initializeArrayBuffer(arrayBuffer);

  const { start } = objectSaver(textEncoder, dataView, initialValue);

  dataView.setUint32(8, start);

  return createObjectWrapper(dataView, start, textDecoder, textEncoder, true);
}

export function getUnderlyingArrayBuffer(objectBuffer: any): ArrayBuffer {
  return objectBuffer[GET_UNDERLYING_ARRAY_BUFFER_SYMBOL];
}

export function createObjectBufferFromArrayBuffer<T = any>(
  textDecoder: any,
  textEncoder: any,
  arrayBuffer: ArrayBuffer,
  // set to true if the give array buffer is not one from `getUnderlyingArrayBuffer`
  shouldInitializeArrayBuffer = false
): T {
  const dataView = shouldInitializeArrayBuffer
    ? initializeArrayBuffer(arrayBuffer)
    : new DataView(arrayBuffer);

  return createObjectWrapper(
    dataView,
    dataView.getUint32(8),
    textDecoder,
    textEncoder
  );
}
