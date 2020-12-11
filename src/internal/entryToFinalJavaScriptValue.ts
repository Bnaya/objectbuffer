import type { ExternalArgs, GlobalCarrier } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { createObjectWrapper } from "./objectWrapper";
import { createArrayWrapper } from "./arrayWrapper";
import { createDateWrapper } from "./dateWrapper";
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
import {
  getAddressesNoLongerUsedArrayForCarrier,
  getCacheFor,
} from "./stateModule";

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

  const cache = getCacheFor(carrier, finalizer);

  let ret = cache.get(pointerToEntry);

  if (!ret) {
    switch (entryType) {
      case ENTRY_TYPE.OBJECT:
        ret = createObjectWrapper(externalArgs, carrier, pointerToEntry);
        break;

      case ENTRY_TYPE.DATE:
        ret = createDateWrapper(externalArgs, carrier, pointerToEntry);
        break;

      case ENTRY_TYPE.ARRAY:
        ret = createArrayWrapper(externalArgs, carrier, pointerToEntry);
        break;

      case ENTRY_TYPE.MAP:
        ret = createMapWrapper(externalArgs, carrier, pointerToEntry);
        break;

      case ENTRY_TYPE.SET:
        ret = createSetWrapper(externalArgs, carrier, pointerToEntry);
        break;
    }

    cache.set(pointerToEntry, ret);
  }

  return ret;
}

function finalizer(carrier: GlobalCarrier, memoryAddress: number) {
  getAddressesNoLongerUsedArrayForCarrier(carrier).push(memoryAddress);
}
