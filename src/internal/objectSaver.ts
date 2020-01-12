import { appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import {
  ObjectEntry,
  ExternalArgs,
  GlobalCarrier,
  MapEntry,
  SetEntry
} from "./interfaces";
import { saveValue } from "./saveValue";
import { createHashMap, hashMapInsertUpdate } from "./hashmap/hashmap";

export function objectSaver(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
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

export function mapSaver(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  referencedPointers: number[],
  mapToSave: Map<string | number, any>
) {
  const hashMapPointer = createHashMap(
    carrier,
    Math.max(externalArgs.hashMapMinInitialCapacity, mapToSave.size * 1.3)
  );

  for (const [key, value] of mapToSave.entries()) {
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

  const objectStartEntry: MapEntry = {
    type: ENTRY_TYPE.MAP,
    refsCount: 1,
    value: hashMapPointer
  };

  return appendEntry(externalArgs, carrier, objectStartEntry);
}

export function setSaver(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  setToSave: Set<string | number>
) {
  const hashMapPointer = createHashMap(
    carrier,
    Math.max(externalArgs.hashMapMinInitialCapacity, setToSave.size * 1.3)
  );

  for (const key of setToSave.keys()) {
    const ptrToPtr = hashMapInsertUpdate(
      externalArgs,
      carrier,
      hashMapPointer,
      key
    );

    carrier.dataView.setUint32(ptrToPtr, 1);
  }

  const objectStartEntry: SetEntry = {
    type: ENTRY_TYPE.SET,
    refsCount: 1,
    value: hashMapPointer
  };

  return appendEntry(externalArgs, carrier, objectStartEntry);
}
