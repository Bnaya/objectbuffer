import {
  primitiveValueToEntry,
  isPrimitive,
  getOurPointerIfApplicable
} from "./utils";
import { appendEntry } from "./store";
import { objectSaver } from "./objectSaver";
import { arraySaver } from "./arraySaver";
import { ExternalArgs, DataViewAndAllocatorCarrier } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";

export function saveValue(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  referencedPointers: number[],
  value: any
) {
  let valuePointer = 0;
  let maybeOurPointer: number | undefined;

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
