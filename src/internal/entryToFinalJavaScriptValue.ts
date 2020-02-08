import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { createDateWrapper } from "./dateWrapper";
import { getCacheFor } from "./externalObjectsCache";
import { decrementRefCount, readEntry } from "./store";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { createMapWrapper } from "./mapWrapper";
import { createSetWrapper } from "./setWrapper";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS
} from "./consts";

// declare const FinalizationGroup: any;
// declare const WeakRef: any;

const TYPE_TO_FACTORY = {
  [ENTRY_TYPE.OBJECT]: createObjectWrapper,
  [ENTRY_TYPE.DATE]: createDateWrapper,
  [ENTRY_TYPE.ARRAY]: createArrayWrapper,
  [ENTRY_TYPE.MAP]: createMapWrapper,
  [ENTRY_TYPE.SET]: createSetWrapper
} as const;

export function entryToFinalJavaScriptValue(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  pointerToEntry: number
) {
  if (pointerToEntry === UNDEFINED_KNOWN_ADDRESS) {
    return undefined;
  }

  if (pointerToEntry === NULL_KNOWN_ADDRESS) {
    return null;
  }

  if (pointerToEntry === TRUE_KNOWN_ADDRESS) {
    return true;
  }

  if (pointerToEntry === FALSE_KNOWN_ADDRESS) {
    return false;
  }

  const valueEntry = readEntry(carrier, pointerToEntry);

  if (isPrimitiveEntryType(valueEntry.type)) {
    return valueEntry.value;
  }

  if (
    valueEntry.type === ENTRY_TYPE.OBJECT ||
    valueEntry.type === ENTRY_TYPE.DATE ||
    valueEntry.type === ENTRY_TYPE.ARRAY ||
    valueEntry.type === ENTRY_TYPE.MAP ||
    valueEntry.type === ENTRY_TYPE.SET
  ) {
    const cache = getCacheFor(carrier, key => {
      finalizer(key, carrier, externalArgs);
    });

    let ret = cache.get(pointerToEntry);

    if (!ret) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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

function finalizer(
  memoryAddress: number,
  carrier: GlobalCarrier,
  externalArgs: ExternalArgs
) {
  const newRefsCount = decrementRefCount(externalArgs, carrier, memoryAddress);

  if (newRefsCount === 0) {
    const freeUs = getAllLinkedAddresses(carrier, false, memoryAddress);

    for (const address of freeUs.leafAddresses) {
      carrier.allocator.free(address);
    }

    for (const address of freeUs.arcAddresses) {
      decrementRefCount(externalArgs, carrier, address);
    }
  }
}
