import { initializeArrayBuffer } from "./store";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { GET_UNDERLYING_ARRAY_BUFFER_SYMBOL } from "./symbols";
import { ExternalArgs } from "./interfaces";

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
    dataView,
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
    dataView,
    dataView.getUint32(16),
    true
  );
}

export type ExternalArgsApi = Readonly<{
  arrayAdditionalAllocation?: number;
  minimumStringAllocation?: number;
  textDecoder: any;
  textEncoder: any;
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
