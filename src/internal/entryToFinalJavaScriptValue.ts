import { Entry, ExternalArgs } from "./interfaces";
import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { getCacheFor } from "./externalObjectsCache";

export function entryToFinalJavaScriptValue(
  externalArgs: ExternalArgs,
  dataView: DataView,
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
    const cache = getCacheFor(dataView.buffer);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createObjectWrapper(
        externalArgs,
        { dataView },
        pointerToEntry,
        false
      );

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  if (valueEntry.type === ENTRY_TYPE.ARRAY) {
    const cache = getCacheFor(dataView.buffer);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createArrayWrapper(externalArgs, { dataView }, pointerToEntry);

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  throw new Error("unsupported yet");
}
