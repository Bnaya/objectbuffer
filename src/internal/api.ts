import { initializeArrayBuffer } from "./store";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { GET_UNDERLYING_ARRAY_BUFFER_SYMBOL } from "./symbols";

export function createObjectBuffer<T = any>(
  textDecoder: any,
  textEncoder: any,
  size: number,
  initialValue: T,
  {
    arrayAdditionalAllocation,
    useSharedArrayBuffer
  }: { arrayAdditionalAllocation?: number; useSharedArrayBuffer?: boolean } = {
    arrayAdditionalAllocation: 0,
    useSharedArrayBuffer: false
  }
): T {
  const arrayBuffer = new (useSharedArrayBuffer
    ? SharedArrayBuffer
    : ArrayBuffer)(size);
  const dataView = initializeArrayBuffer(arrayBuffer);

  const { start } = objectSaver(
    textEncoder,
    dataView,
    arrayAdditionalAllocation || 0,
    initialValue
  );

  dataView.setUint32(16, start);

  return createObjectWrapper(dataView, start, textDecoder, textEncoder, true);
}

export function getUnderlyingArrayBuffer(
  objectBuffer: any
): ArrayBuffer | SharedArrayBuffer {
  return objectBuffer[GET_UNDERLYING_ARRAY_BUFFER_SYMBOL];
}

export function createObjectBufferFromArrayBuffer<T = any>(
  textDecoder: any,
  textEncoder: any,
  arrayBuffer: ArrayBuffer | SharedArrayBuffer,
  // set to true if the give array buffer is not one from `getUnderlyingArrayBuffer`
  shouldInitializeArrayBuffer = false,
  { arrayAdditionalAllocation }: { arrayAdditionalAllocation?: number } = {
    arrayAdditionalAllocation: 0
  }
): T {
  const dataView = shouldInitializeArrayBuffer
    ? initializeArrayBuffer(arrayBuffer)
    : new DataView(arrayBuffer);

  return createObjectWrapper(
    dataView,
    dataView.getUint32(16),
    textDecoder,
    textEncoder,
    true,
    arrayAdditionalAllocation
  );
}
