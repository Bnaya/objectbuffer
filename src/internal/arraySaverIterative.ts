import { ENTRY_TYPE } from "./entry-types";
import { GlobalCarrier } from "./interfaces";
import { array_set_all, array_size } from "./generatedStructs";

export function arraySaverIterative(
  arrayAdditionalAllocation: number,
  carrier: GlobalCarrier,
  valuesToSave: unknown[],
  pointersToSaveTo: number[],
  arrayToSave: unknown[]
) {
  const arrayLength = arrayToSave.length;

  const arrayStructPointer = carrier.allocator.calloc(array_size);
  const arrayPointersSpaceStart = carrier.allocator.calloc(
    (arrayLength + arrayAdditionalAllocation) * Uint32Array.BYTES_PER_ELEMENT
  );

  array_set_all(
    carrier.heap,
    arrayStructPointer,
    ENTRY_TYPE.ARRAY,
    // ARC starts with 1
    1,
    arrayPointersSpaceStart,
    arrayLength,
    arrayLength + arrayAdditionalAllocation
  );

  for (let i = 0; i < arrayLength; i += 1) {
    valuesToSave.push(arrayToSave[i]);
    pointersToSaveTo.push(
      arrayPointersSpaceStart + i * Uint32Array.BYTES_PER_ELEMENT
    );
  }

  return arrayStructPointer;
}
