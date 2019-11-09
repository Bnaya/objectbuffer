import { ExternalArgs, DataViewAndAllocatorCarrier } from "./interfaces";
import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { createDateWrapper } from "./dateWrapper";
import { getCacheFor } from "./externalObjectsCache";
import { decrementRefCount, readEntry } from "./store";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";

declare const FinalizationGroup: any;
declare const WeakRef: any;

const TYPE_TO_FACTORY = {
  [ENTRY_TYPE.OBJECT]: createObjectWrapper,
  [ENTRY_TYPE.DATE]: createDateWrapper,
  [ENTRY_TYPE.ARRAY]: createArrayWrapper
} as const;

export function entryToFinalJavaScriptValue(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  pointerToEntry: number
) {
  const valueEntry = readEntry(externalArgs, carrier.dataView, pointerToEntry);

  if (valueEntry.type === ENTRY_TYPE.NULL) {
    return null;
  }

  if (valueEntry.type === ENTRY_TYPE.UNDEFINED) {
    return undefined;
  }

  if (isPrimitiveEntryType(valueEntry.type)) {
    return valueEntry.value;
  }

  if (
    valueEntry.type === ENTRY_TYPE.OBJECT ||
    valueEntry.type === ENTRY_TYPE.DATE ||
    valueEntry.type === ENTRY_TYPE.ARRAY
  ) {
    const cache = getCacheFor(carrier, (memoryAddress: number) => {
      const newRefsCount = decrementRefCount(
        externalArgs,
        carrier.dataView,
        memoryAddress
      );

      if (newRefsCount === 0) {
        const freeUs = getAllLinkedAddresses(
          externalArgs,
          carrier.dataView,
          false,
          memoryAddress
        );

        for (const address of freeUs) {
          carrier.allocator.free(address);
        }
      }
    });
    let ret = cache.get(pointerToEntry);

    if (!ret) {
      ret = TYPE_TO_FACTORY[valueEntry.type](
        externalArgs,
        carrier,
        pointerToEntry
      );
      cache.set(pointerToEntry, ret);
    }

    return ret;
  }

  throw new Error("unsupported yet");
}
