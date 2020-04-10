import {
  ExternalArgs,
  GlobalCarrier,
  StringEntry,
  NumberEntry,
  MapEntry,
  SetEntry,
} from "./interfaces";
import {
  readEntry,
  writeValueInPtrToPtrAndHandleMemory,
  handleArcForDeletedValuePointer,
  decrementRefCount,
  writeEntry,
} from "./store";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import {
  hashMapDelete,
  hashMapLowLevelIterator,
  hashMapNodePointerToKeyValue,
  hashMapInsertUpdate,
  hashMapValueLookup,
  createHashMap,
} from "./hashmap/hashmap";
import { getObjectOrMapOrSetAddresses } from "./getAllLinkedAddresses";

export function deleteObjectPropertyEntryByKey(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  hashmapPointer: number,
  keyToDeleteBy: string | number
): boolean {
  const deletedValuePointerToPointer = hashMapDelete(
    carrier,
    hashmapPointer,
    keyToDeleteBy
  );

  // no such key
  if (deletedValuePointerToPointer === 0) {
    return false;
  }

  const deletedValuePointer =
    carrier.uint32[
      deletedValuePointerToPointer / Uint32Array.BYTES_PER_ELEMENT
    ];

  handleArcForDeletedValuePointer(externalArgs, carrier, deletedValuePointer);

  return true;
}

export function getObjectPropertiesEntries(
  carrier: GlobalCarrier,
  hashmapPointer: number
): Array<{ key: string | number; valuePointer: number }> {
  let iterator = 0;
  const foundValues: Array<{ key: string | number; valuePointer: number }> = [];

  while (
    (iterator = hashMapLowLevelIterator(carrier, hashmapPointer, iterator))
  ) {
    const { valuePointer, keyPointer } = hashMapNodePointerToKeyValue(
      carrier,
      iterator
    );

    const keyEntry = readEntry(carrier, keyPointer) as
      | StringEntry
      | NumberEntry;

    foundValues.push({
      valuePointer:
        carrier.uint32[valuePointer / Uint32Array.BYTES_PER_ELEMENT],
      key: keyEntry.value,
    });
  }

  return foundValues;
}

export function objectSet(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  hashMapPointer: number,
  p: string | number,
  value: any
) {
  const ptrToPtr = hashMapInsertUpdate(
    externalArgs,
    carrier,
    hashMapPointer,
    p
  );

  writeValueInPtrToPtrAndHandleMemory(externalArgs, carrier, ptrToPtr, value);
}

export function objectGet(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  entryPointer: number,
  key: string | number
) {
  const valuePointer = hashMapValueLookup(carrier, entryPointer, key);

  if (valuePointer === 0) {
    return undefined;
  }

  return entryToFinalJavaScriptValue(
    externalArgs,
    carrier,
    carrier.uint32[valuePointer / Uint32Array.BYTES_PER_ELEMENT]
  );
}

export function hashmapClearFree(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  hashmapPointer: number
) {
  const leafAddresses: number[] = [];
  const arcAddresses: number[] = [];

  getObjectOrMapOrSetAddresses(
    carrier,
    false,
    hashmapPointer,
    leafAddresses,
    arcAddresses
  );

  for (const address of leafAddresses) {
    carrier.allocator.free(address);
  }

  for (const address of arcAddresses) {
    decrementRefCount(externalArgs, carrier, address);
  }
}

export function mapOrSetClear(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  mapOrSetPtr: number
) {
  const entry = readEntry(carrier, mapOrSetPtr) as MapEntry | SetEntry;

  hashmapClearFree(externalArgs, carrier, entry.value);

  entry.value = createHashMap(carrier, externalArgs.hashMapMinInitialCapacity);

  writeEntry(carrier, mapOrSetPtr, entry);
}
