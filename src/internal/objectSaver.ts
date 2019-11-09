// import { isPrimitive, primitiveValueToEntry } from "./utils";
import { appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import {
  ObjectEntry,
  ExternalArgs,
  DataViewAndAllocatorCarrier
} from "./interfaces";
import { saveValue } from "./saveValue";
import { createHashMap, hashMapInsertUpdate } from "./hashmap/hashmap";

export function objectSaver(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  referencedPointers: number[],
  objectToSave: any
) {
  const objectEntries = Object.entries(objectToSave);

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(externalArgs.hashMapMinInitialCapacity, objectEntries.length * 1.3)
  );

  for (const [key, value] of objectEntries) {
    const ptrToPtr = hashMapInsertUpdate(
      externalArgs,
      carrier,
      hashMapPointer,
      key
    );

    const pointerToValue = saveValue(
      externalArgs,
      carrier,
      referencedPointers,
      value
    );

    carrier.dataView.setUint32(ptrToPtr, pointerToValue);
  }

  const objectStartEntry: ObjectEntry = {
    type: ENTRY_TYPE.OBJECT,
    refsCount: 1,
    value: hashMapPointer
  };

  return appendEntry(externalArgs, carrier, objectStartEntry);
}
