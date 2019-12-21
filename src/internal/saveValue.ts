import {
  primitiveValueToEntry,
  isPrimitive,
  getOurPointerIfApplicable
} from "./utils";
import { appendEntry } from "./store";
import { objectSaver, mapSaver, setSaver } from "./objectSaver";
import { arraySaver } from "./arraySaver";
import { ExternalArgs, DataViewAndAllocatorCarrier } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS
} from "./consts";

/**
 * Returns pointer for the value
 */
export function saveValue(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  referencedPointers: number[],
  value: any
) {
  let valuePointer = 0;
  let maybeOurPointer: number | undefined;

  if (value === undefined) {
    return UNDEFINED_KNOWN_ADDRESS;
  }

  if (value === null) {
    return NULL_KNOWN_ADDRESS;
  }

  if (value === true) {
    return TRUE_KNOWN_ADDRESS;
  }

  if (value === false) {
    return FALSE_KNOWN_ADDRESS;
  }

  if (isPrimitive(value)) {
    const entry = primitiveValueToEntry(
      externalArgs,
      value,
      externalArgs.minimumStringAllocation
    );
    valuePointer = appendEntry(externalArgs, carrier, entry);
  } else if (
    (maybeOurPointer = getOurPointerIfApplicable(value, carrier.dataView))
  ) {
    valuePointer = maybeOurPointer;
    referencedPointers.push(valuePointer);
  } else if (Array.isArray(value)) {
    valuePointer = arraySaver(externalArgs, carrier, referencedPointers, value);
  } else if (value instanceof Date) {
    valuePointer = appendEntry(externalArgs, carrier, {
      type: ENTRY_TYPE.DATE,
      refsCount: 1,
      value: value.getTime()
    });
  } else if (value instanceof Map) {
    valuePointer = mapSaver(externalArgs, carrier, referencedPointers, value);
  } else if (value instanceof Set) {
    valuePointer = setSaver(externalArgs, carrier, value);
  } else if (typeof value === "object") {
    valuePointer = objectSaver(
      externalArgs,
      carrier,
      referencedPointers,
      value
    );
  } else {
    throw new Error("unsupported yet");
  }

  return valuePointer;
}
