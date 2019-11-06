// import { isPrimitive, primitiveValueToEntry } from "./utils";
import { appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import {
  ObjectPropEntry,
  ObjectEntry,
  ExternalArgs,
  DataViewAndAllocatorCarrier
} from "./interfaces";
import { saveValue } from "./saveValue";

export function objectSaver(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  referencedPointers: number[],
  objectToSave: any
) {
  const objectEntries = Object.entries(objectToSave).reverse();

  let nextObjectEntryPointer = 0;

  for (const [key, value] of objectEntries) {
    const rOfValue = saveValue(
      externalArgs,
      carrier,
      referencedPointers,
      value
    );

    const objectPropEntry: ObjectPropEntry = {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        value: rOfValue,
        key,
        next: nextObjectEntryPointer
      }
    };

    const rOfPropEntry = appendEntry(externalArgs, carrier, objectPropEntry);

    nextObjectEntryPointer = rOfPropEntry;
  }

  const objectStartEntry: ObjectEntry = {
    type: ENTRY_TYPE.OBJECT,
    refsCount: 1,
    value: nextObjectEntryPointer
  };

  return appendEntry(externalArgs, carrier, objectStartEntry);
}
