import { appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import { ArrayEntry, ExternalArgs, GlobalCarrier } from "./interfaces";
import { saveValue } from "./saveValue";

export function arraySaver(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  referencedPointers: number[],
  arrayToSave: Array<any>
) {
  let memoryForPointersCursor = carrier.allocator.calloc(
    (arrayToSave.length + externalArgs.arrayAdditionalAllocation) *
      Uint32Array.BYTES_PER_ELEMENT
  );

  const arrayStartEntry: ArrayEntry = {
    type: ENTRY_TYPE.ARRAY,
    refsCount: 1,
    value: memoryForPointersCursor,
    allocatedLength:
      arrayToSave.length + externalArgs.arrayAdditionalAllocation,
    length: arrayToSave.length
  };

  for (const item of arrayToSave) {
    const rOfValue = saveValue(externalArgs, carrier, referencedPointers, item);

    carrier.uint32[
      memoryForPointersCursor / Uint32Array.BYTES_PER_ELEMENT
    ] = rOfValue;

    memoryForPointersCursor += Uint32Array.BYTES_PER_ELEMENT;
  }

  const arrayEntryAppendResult = appendEntry(
    externalArgs,
    carrier,
    arrayStartEntry
  );

  return arrayEntryAppendResult;
}
