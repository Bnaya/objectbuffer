import { Entry, ExternalArgs, DataViewCarrier } from "./interfaces";
import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { createDateWrapper } from "./dateWrapper";
import { getCacheFor } from "./externalObjectsCache";

export function entryToFinalJavaScriptValue(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewCarrier,
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
    const cache = getCacheFor(dataViewCarrier.dataView.buffer);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createObjectWrapper(
        externalArgs,
        dataViewCarrier,
        pointerToEntry,
        false
      );

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  if (valueEntry.type === ENTRY_TYPE.ARRAY) {
    const cache = getCacheFor(dataViewCarrier.dataView.buffer);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createArrayWrapper(externalArgs, dataViewCarrier, pointerToEntry);

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  if (valueEntry.type === ENTRY_TYPE.DATE) {
    const cache = getCacheFor(dataViewCarrier.dataView.buffer);

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = createDateWrapper(externalArgs, dataViewCarrier, pointerToEntry);

      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  throw new Error("unsupported yet");
}
