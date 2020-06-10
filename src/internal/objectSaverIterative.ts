import { ENTRY_TYPE } from "./entry-types";
import { ExternalArgs, GlobalCarrier } from "./interfaces";
import {
  createHashMap,
  hashMapInsertUpdateKeyIsPointerReturnNode,
} from "./hashmap/hashmap";
import {
  object_size,
  object_set_all,
  hashmapNode_KEY_POINTER_get,
  hashmapNode_VALUE_POINTER_place,
} from "./generatedStructs";
import { saveStringOrNumber, freeStringOrNumber } from "./store";

export function objectSaverIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  valuesToSave: any[],
  pointersToSaveTo: number[],
  savedValuesToPointer: Map<unknown, number>,
  referencedExistingPointers: number[],
  objectToSave: any
) {
  const { heap, allocator } = carrier;
  const pointerToStruct = allocator.malloc(object_size);

  const objectEntries = Object.entries(objectToSave);
  const objectEntriesLength = objectEntries.length;

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(
      externalArgs.hashMapMinInitialCapacity,
      Math.ceil(objectEntriesLength * 1.3)
    )
  );

  let newKeyPointer: number | undefined;
  for (let i = 0; i < objectEntriesLength; i += 1) {
    newKeyPointer = savedValuesToPointer.get(objectEntries[i][0]);
    if (newKeyPointer) {
      referencedExistingPointers.push(newKeyPointer);
    } else {
      newKeyPointer = saveStringOrNumber(carrier, objectEntries[i][0]);
    }

    const ptrToNode = hashMapInsertUpdateKeyIsPointerReturnNode(
      externalArgs,
      carrier,
      hashMapPointer,
      newKeyPointer
    );

    // on value saver, that code branch is not expected to happen
    // Because we are creating new objects
    if (hashmapNode_KEY_POINTER_get(heap, ptrToNode) !== newKeyPointer) {
      // The key is already exits, we can dispose the new key memory
      freeStringOrNumber(carrier, newKeyPointer);
    } else {
      if (typeof objectEntries[i][0] === "string") {
        savedValuesToPointer.set(objectEntries[i][0], newKeyPointer);
      }
    }

    const ptrToPtrForObjectPropValue =
      ptrToNode + hashmapNode_VALUE_POINTER_place;

    valuesToSave.push(objectEntries[i][1]);
    pointersToSaveTo.push(ptrToPtrForObjectPropValue);
  }

  object_set_all(heap, pointerToStruct, ENTRY_TYPE.OBJECT, 1, hashMapPointer);

  return pointerToStruct;
}

export function mapSaverIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  valuesToSave: any[],
  pointersToSaveTo: number[],
  savedValuesToPointer: Map<unknown, number>,
  referencedExistingPointers: number[],
  mapToSave: Map<unknown, unknown>
) {
  const { heap, allocator } = carrier;
  const pointerToStruct = allocator.malloc(object_size);

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(
      externalArgs.hashMapMinInitialCapacity,
      Math.ceil(mapToSave.size * 1.3)
    )
  );

  let newKeyPointer: number | undefined;
  for (const [key, value] of mapToSave) {
    newKeyPointer = savedValuesToPointer.get(key);
    if (newKeyPointer) {
      referencedExistingPointers.push(newKeyPointer);
    } else {
      newKeyPointer = saveStringOrNumber(carrier, key as string | number);
    }

    const ptrToNode = hashMapInsertUpdateKeyIsPointerReturnNode(
      externalArgs,
      carrier,
      hashMapPointer,
      newKeyPointer
    );

    // on value saver, that code branch is not expected to happen
    // Because we are creating new objects
    if (hashmapNode_KEY_POINTER_get(heap, ptrToNode) !== newKeyPointer) {
      // The key is already exits, we can dispose the new key memory
      freeStringOrNumber(carrier, newKeyPointer);
    } else {
      if (typeof key === "string") {
        savedValuesToPointer.set(key, newKeyPointer);
      }
    }

    const ptrToPtrForObjectPropValue =
      ptrToNode + hashmapNode_VALUE_POINTER_place;

    valuesToSave.push(value);
    pointersToSaveTo.push(ptrToPtrForObjectPropValue);
  }

  object_set_all(heap, pointerToStruct, ENTRY_TYPE.MAP, 1, hashMapPointer);

  return pointerToStruct;
}

export function setSaverIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  savedValuesToPointer: Map<unknown, number>,
  referencedExistingPointers: number[],
  setToSave: Set<unknown>
) {
  const { heap, allocator } = carrier;

  const pointerToStruct = allocator.malloc(object_size);

  const hashMapPointer = createHashMap(
    carrier,
    Math.max(
      externalArgs.hashMapMinInitialCapacity,
      Math.ceil(setToSave.size * 1.3)
    )
  );

  let newKeyPointer: number | undefined;
  for (const key of setToSave) {
    newKeyPointer = savedValuesToPointer.get(key);
    if (newKeyPointer) {
      referencedExistingPointers.push(newKeyPointer);
    } else {
      newKeyPointer = saveStringOrNumber(carrier, key as string | number);
    }

    const ptrToNode = hashMapInsertUpdateKeyIsPointerReturnNode(
      externalArgs,
      carrier,
      hashMapPointer,
      newKeyPointer
    );

    // on value saver, that code branch is not expected to happen
    // Because we are creating new objects
    if (hashmapNode_KEY_POINTER_get(heap, ptrToNode) !== newKeyPointer) {
      // The key is already exits, we can dispose the new key memory
      freeStringOrNumber(carrier, newKeyPointer);
    } else {
      if (typeof key === "string") {
        savedValuesToPointer.set(key, newKeyPointer);
      }
    }
  }

  object_set_all(heap, pointerToStruct, ENTRY_TYPE.SET, 1, hashMapPointer);

  object_set_all(
    carrier.heap,
    pointerToStruct,
    ENTRY_TYPE.SET,
    1,
    hashMapPointer
  );

  return pointerToStruct;
}
