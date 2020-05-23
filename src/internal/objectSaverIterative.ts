import { ENTRY_TYPE } from "./entry-types";
import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { createHashMap, hashMapInsertUpdate } from "./hashmap/hashmap";
import { object_size, object_set_all } from "./generatedStructs";

export function objectSaverIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  valuesToSave: any[],
  pointersToSaveTo: number[],
  objectToSave: any
) {
  const pointerToStruct = carrier.allocator.malloc(object_size);

  const objectEntries = Object.entries(objectToSave);
  const objectEntriesLength = objectEntries.length;

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(
      externalArgs.hashMapMinInitialCapacity,
      Math.ceil(objectEntriesLength * 1.3)
    )
  );

  for (let i = 0; i < objectEntriesLength; i += 1) {
    const ptrToPtrForObjectPropValue = hashMapInsertUpdate(
      externalArgs,
      carrier,
      hashMapPointer,
      objectEntries[i][0]
    );

    valuesToSave.push(objectEntries[i][1]);
    pointersToSaveTo.push(ptrToPtrForObjectPropValue);
  }

  object_set_all(
    carrier.heap,
    pointerToStruct,
    ENTRY_TYPE.OBJECT,
    1,
    hashMapPointer
  );

  return pointerToStruct;
}

export function mapSaverIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  valuesToSave: any[],
  pointersToSaveTo: number[],
  mapToSave: Map<unknown, unknown>
) {
  const pointerToStruct = carrier.allocator.malloc(object_size);

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(
      externalArgs.hashMapMinInitialCapacity,
      Math.ceil(mapToSave.size * 1.3)
    )
  );

  for (const [key, value] of mapToSave) {
    const ptrToPtrForObjectPropValue = hashMapInsertUpdate(
      externalArgs,
      carrier,
      hashMapPointer,
      key as string | number
    );

    valuesToSave.push(value);
    pointersToSaveTo.push(ptrToPtrForObjectPropValue);
  }

  object_set_all(
    carrier.heap,
    pointerToStruct,
    ENTRY_TYPE.MAP,
    1,
    hashMapPointer
  );

  return pointerToStruct;
}
export function setSaverIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  setToSave: Set<unknown>
) {
  const pointerToStruct = carrier.allocator.malloc(object_size);

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(
      externalArgs.hashMapMinInitialCapacity,
      Math.ceil(setToSave.size * 1.3)
    )
  );

  for (const key of setToSave) {
    hashMapInsertUpdate(
      externalArgs,
      carrier,
      hashMapPointer,
      key as string | number
    );
  }

  object_set_all(
    carrier.heap,
    pointerToStruct,
    ENTRY_TYPE.SET,
    1,
    hashMapPointer
  );

  return pointerToStruct;
}
