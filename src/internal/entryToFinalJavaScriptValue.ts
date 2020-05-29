import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { createDateWrapper } from "./dateWrapper";
import { getCacheFor } from "./externalObjectsCache";
import { decrementRefCount } from "./store";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { createMapWrapper } from "./mapWrapper";
import { createSetWrapper } from "./setWrapper";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS,
} from "./consts";
import {
  typeOnly_type_get,
  number_value_get,
  bigint_value_get,
} from "./generatedStructs";
import { readString } from "./readString";

const TYPE_TO_FACTORY = {
  [ENTRY_TYPE.OBJECT]: createObjectWrapper,
  [ENTRY_TYPE.DATE]: createDateWrapper,
  [ENTRY_TYPE.ARRAY]: createArrayWrapper,
  [ENTRY_TYPE.MAP]: createMapWrapper,
  [ENTRY_TYPE.SET]: createSetWrapper,
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

  const entryType: ENTRY_TYPE = typeOnly_type_get(carrier.heap, pointerToEntry);

  switch (entryType) {
    case ENTRY_TYPE.NUMBER:
      return number_value_get(carrier.heap, pointerToEntry);
      break;

    case ENTRY_TYPE.STRING:
      return readString(carrier.heap, pointerToEntry);
      break;

    case ENTRY_TYPE.BIGINT_POSITIVE:
      return bigint_value_get(carrier.heap, pointerToEntry);
      break;

    case ENTRY_TYPE.BIGINT_NEGATIVE:
      return bigint_value_get(carrier.heap, pointerToEntry) * BigInt("-1");
      break;
  }

  // this is an invariant
  if (
    !(
      entryType === ENTRY_TYPE.OBJECT ||
      entryType === ENTRY_TYPE.DATE ||
      entryType === ENTRY_TYPE.ARRAY ||
      entryType === ENTRY_TYPE.MAP ||
      entryType === ENTRY_TYPE.SET
    )
  ) {
    throw new Error("Nope Nope Nope");
  }

  const cache = getCacheFor(carrier, (key) => {
    finalizer(key, carrier);
  });

  let ret = cache.get(pointerToEntry);

  if (!ret) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ret = TYPE_TO_FACTORY[entryType](externalArgs, carrier, pointerToEntry);
    cache.set(pointerToEntry, ret);
  }

  return ret;
}

/* istanbul ignore next */
function finalizer(memoryAddress: number, carrier: GlobalCarrier) {
  const newRefsCount = decrementRefCount(carrier.heap, memoryAddress);

  if (newRefsCount === 0) {
    const freeUs = getAllLinkedAddresses(carrier.heap, false, memoryAddress);

    for (const address of freeUs.leafAddresses) {
      carrier.allocator.free(address);
    }

    for (const address of freeUs.arcAddresses) {
      decrementRefCount(carrier.heap, address);
    }
  }
}
