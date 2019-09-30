import { Entry } from "./interfaces";
import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";

export function entryToFinalJavaScriptValue(
  dataView: DataView,
  textDecoder: any,
  textEncoder: any,
  arrayAdditionalAllocation: number,
  valueEntry: Entry,
  pointerToEntry: number
) {
  if (valueEntry.type === ENTRY_TYPE.NULL) {
    return null;
  }

  if (valueEntry.type === ENTRY_TYPE.UNDEFINED) {
    return undefined;
  }

  if (isPrimitiveEntryType(valueEntry.type)) {
    return valueEntry.value;
  }

  if (valueEntry.type === ENTRY_TYPE.OBJECT) {
    return createObjectWrapper(
      dataView,
      pointerToEntry,
      textDecoder,
      textEncoder
    );
  }

  if (valueEntry.type === ENTRY_TYPE.ARRAY) {
    return createArrayWrapper(
      dataView,
      arrayAdditionalAllocation,
      pointerToEntry,
      textDecoder,
      textEncoder
    );
  }

  throw new Error("unsupported yet");
}
