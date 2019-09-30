import { appendEntry, reserveMemory } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import { ArrayEntry } from "./interfaces";
import { saveValue } from "./saveValue";

export function arraySaver(
  textEncoder: any,
  dataView: DataView,
  arrayAdditionalAllocation: number,
  arrayToSave: Array<any>
) {
  let totalWrittenBytes = 0;

  let memoryForPointersCursor = reserveMemory(
    dataView,
    (arrayToSave.length + arrayAdditionalAllocation) *
      Uint32Array.BYTES_PER_ELEMENT
  );

  totalWrittenBytes +=
    (arrayToSave.length + arrayAdditionalAllocation) *
    Uint32Array.BYTES_PER_ELEMENT;

  const arrayStartEntry: ArrayEntry = {
    type: ENTRY_TYPE.ARRAY,
    value: memoryForPointersCursor,
    allocatedLength: arrayToSave.length + arrayAdditionalAllocation,
    length: arrayToSave.length
  };

  for (const item of arrayToSave) {
    const rOfValue = saveValue(
      textEncoder,
      dataView,
      arrayAdditionalAllocation,
      item
    );

    dataView.setUint32(memoryForPointersCursor, rOfValue.start);
    memoryForPointersCursor += Uint32Array.BYTES_PER_ELEMENT;

    totalWrittenBytes += rOfValue.length;
  }

  const arrayEntryAppendResult = appendEntry(
    dataView,
    arrayStartEntry,
    textEncoder
  );

  totalWrittenBytes += arrayEntryAppendResult.length;

  return {
    start: arrayEntryAppendResult.start,
    length: totalWrittenBytes
  };
}
