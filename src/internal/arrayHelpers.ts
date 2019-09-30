import { readEntry, reserveMemory, writeEntry } from "./store";
import { ArrayEntry } from "./interfaces";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { saveValue } from "./saveValue";
import { ENTRY_TYPE } from "./entry-types";
import { assertNonNull } from "./assertNonNull";

export function arrayGetMetadata(
  dataView: DataView,
  textDecoder: any,
  pointerToArrayEntry: number
) {
  const [arrayEntry] = readEntry(
    dataView,
    pointerToArrayEntry,
    textDecoder
  ) as [ArrayEntry, number];

  return arrayEntry;
}

export function arrayGetPointersToValue(
  dataView: DataView,
  textDecoder: any,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const metadata = arrayGetMetadata(dataView, textDecoder, pointerToArrayEntry);

  // out of bound
  if (indexToGet >= metadata.length) {
    return undefined;
  }

  const pointerToThePointer =
    metadata.value + indexToGet * Uint32Array.BYTES_PER_ELEMENT;

  const pointer = dataView.getUint32(pointerToThePointer);

  return {
    pointer,
    pointerToThePointer
  };
}

export function getFinalValueAtArrayIndex(
  dataView: DataView,
  textDecoder: any,
  textEncoder: any,
  arrayAdditionalAllocation: number,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const pointers = arrayGetPointersToValue(
    dataView,
    textDecoder,
    pointerToArrayEntry,
    indexToGet
  );

  if (pointers === undefined) {
    return undefined;
  }

  const entry = readEntry(dataView, pointers.pointer, textDecoder);

  return entryToFinalJavaScriptValue(
    dataView,
    textDecoder,
    textEncoder,
    arrayAdditionalAllocation,
    entry[0],
    pointers.pointer
  );
}

export function setValuePointerAtArrayIndex(
  dataView: DataView,
  textDecoder: any,
  textEncoder: any,
  arrayAdditionalAllocation: number,
  pointerToArrayEntry: number,
  indexToSet: number,
  pointerToEntry: number
) {
  const metadata = arrayGetMetadata(dataView, textDecoder, pointerToArrayEntry);

  if (indexToSet >= metadata.length) {
    // we need to re-allocate the array in a new and bigger place
    if (indexToSet >= metadata.allocatedLength) {
      reallocateArray(
        dataView,
        textDecoder,
        textEncoder,
        pointerToArrayEntry,
        indexToSet + 1 + arrayAdditionalAllocation,
        indexToSet + 1
      );
    } else {
      // no need to re-allocated, just push the length forward
      writeEntry(
        dataView,
        pointerToArrayEntry,
        {
          type: ENTRY_TYPE.ARRAY,
          value: metadata.value,
          allocatedLength: metadata.allocatedLength,
          length: indexToSet + 1
        },
        textEncoder
      );
    }
  }

  const pointers = arrayGetPointersToValue(
    dataView,
    textDecoder,
    pointerToArrayEntry,
    indexToSet
  );

  assertNonNull(pointers);

  dataView.setUint32(pointers.pointerToThePointer, pointerToEntry);
}

export function setValueAtArrayIndex(
  dataView: DataView,
  textDecoder: any,
  textEncoder: any,
  arrayAdditionalAllocation: number,
  pointerToArrayEntry: number,
  indexToSet: number,
  value: any
) {
  const saveValueResult = saveValue(
    textEncoder,
    dataView,
    arrayAdditionalAllocation,
    value
  );

  setValuePointerAtArrayIndex(
    dataView,
    textDecoder,
    textEncoder,
    arrayAdditionalAllocation,
    pointerToArrayEntry,
    indexToSet,
    saveValueResult.start
  );
}

function reallocateArray(
  dataView: DataView,
  textDecoder: any,
  textEncoder: any,
  pointerToArrayEntry: number,
  newAllocatedLength: number,
  newLength: number
) {
  const metadata = arrayGetMetadata(dataView, textDecoder, pointerToArrayEntry);

  const newArrayValueLocation = reserveMemory(
    dataView,
    newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT
  );

  for (
    let memoryToCopyIndex = 0;
    memoryToCopyIndex < metadata.length;
    memoryToCopyIndex += 1
  ) {
    dataView.setUint32(
      newArrayValueLocation + memoryToCopyIndex * Uint32Array.BYTES_PER_ELEMENT,
      dataView.getUint32(
        metadata.value + memoryToCopyIndex * Uint32Array.BYTES_PER_ELEMENT
      )
    );
  }

  writeEntry(
    dataView,
    pointerToArrayEntry,
    {
      type: ENTRY_TYPE.ARRAY,
      value: newArrayValueLocation,
      allocatedLength: newAllocatedLength,
      length: newLength
    },
    textEncoder
  );
}
