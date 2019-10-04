import { Entry } from "./interfaces";
import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { getCacheFor } from "./externalObjectsCache";

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
    const cache = getCacheFor(dataView);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createObjectWrapper(
        dataView,
        pointerToEntry,
        textDecoder,
        textEncoder,
        false,
        arrayAdditionalAllocation
      );

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  if (valueEntry.type === ENTRY_TYPE.ARRAY) {
    const cache = getCacheFor(dataView);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createArrayWrapper(
        dataView,
        arrayAdditionalAllocation,
        pointerToEntry,
        textDecoder,
        textEncoder
      );

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  throw new Error("unsupported yet");
}
