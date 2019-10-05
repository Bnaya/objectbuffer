import { appendEntry, reserveMemory } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import { ArrayEntry, ExternalArgs } from "./interfaces";
import { saveValue } from "./saveValue";

export function arraySaver(
  externalArgs: ExternalArgs,
  dataView: DataView,
  arrayToSave: Array<any>
) {
  let totalWrittenBytes = 0;

  let memoryForPointersCursor = reserveMemory(
    dataView,
    (arrayToSave.length + externalArgs.arrayAdditionalAllocation) *
      Uint32Array.BYTES_PER_ELEMENT
  );

  totalWrittenBytes +=
    (arrayToSave.length + externalArgs.arrayAdditionalAllocation) *
    Uint32Array.BYTES_PER_ELEMENT;

  const arrayStartEntry: ArrayEntry = {
    type: ENTRY_TYPE.ARRAY,
    value: memoryForPointersCursor,
    allocatedLength:
      arrayToSave.length + externalArgs.arrayAdditionalAllocation,
    length: arrayToSave.length
  };

  for (const item of arrayToSave) {
    const rOfValue = saveValue(externalArgs, dataView, item);

    dataView.setUint32(memoryForPointersCursor, rOfValue.start);
    memoryForPointersCursor += Uint32Array.BYTES_PER_ELEMENT;

    totalWrittenBytes += rOfValue.length;
  }

  const arrayEntryAppendResult = appendEntry(
    externalArgs,
    dataView,
    arrayStartEntry
  );

  totalWrittenBytes += arrayEntryAppendResult.length;

  return {
    start: arrayEntryAppendResult.start,
    length: totalWrittenBytes
  };
}
