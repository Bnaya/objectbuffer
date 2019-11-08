import {
  ExternalArgs,
  DataViewAndAllocatorCarrier,
  StringEntry,
  NumberEntry
} from "./interfaces";
import {
  readEntry,
  decrementRefCount,
  writeValueInPtrToPtrAndHandleMemory
} from "./store";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import {
  hashMapDelete,
  hashMapLowLevelIterator,
  hashMapNodePointerToKeyValue,
  hashMapInsertUpdate,
  hashMapValueLookup
} from "./hashmap/hashmap";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";

export function deleteObjectPropertyEntryByKey(
  externalArgs: ExternalArgs,
  { dataView, allocator }: DataViewAndAllocatorCarrier,
  hashmapPointer: number,
  keyToDeleteBy: string | number
): boolean {
  const deletedValuePointerToPointer = hashMapDelete(
    externalArgs,
    { dataView, allocator },
    hashmapPointer,
    keyToDeleteBy
  );

  const deletedValuePointer = dataView.getUint32(deletedValuePointerToPointer);

  // Nothing to delete here
  if (deletedValuePointer === 0) {
    return false;
  }

  // handle memory free
  if (deletedValuePointer !== 0) {
    const existingValueEntry = readEntry(
      externalArgs,
      dataView,
      deletedValuePointer
    );
    if (existingValueEntry && "refsCount" in existingValueEntry) {
      const newRefCount = decrementRefCount(
        externalArgs,
        dataView,
        deletedValuePointer
      );

      if (newRefCount === 0) {
        const addressesToFree = getAllLinkedAddresses(
          externalArgs,
          dataView,
          false,
          deletedValuePointer
        );

        for (const address of addressesToFree) {
          allocator.free(address);
        }
      }
    } else {
      allocator.free(deletedValuePointer);
    }
  }

  return true;
}

export function getObjectPropertiesEntries(
  externalArgs: ExternalArgs,
  dataView: DataView,
  hashmapPointer: number
): Array<{ key: string | number; valuePointer: number }> {
  let iterator = 0;
  const foundValues: Array<{ key: string | number; valuePointer: number }> = [];

  while (
    (iterator = hashMapLowLevelIterator(dataView, hashmapPointer, iterator))
  ) {
    const { valuePointer, keyPointer } = hashMapNodePointerToKeyValue(
      dataView,
      iterator
    );

    const keyEntry = readEntry(externalArgs, dataView, keyPointer) as
      | StringEntry
      | NumberEntry;

    foundValues.push({
      valuePointer: dataView.getUint32(valuePointer),
      key: keyEntry.value
    });
  }

  return foundValues;
}

export function objectSet(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
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
  carrier: DataViewAndAllocatorCarrier,
  entryPointer: number,
  key: string | number
) {
  const valuePointer = hashMapValueLookup(
    externalArgs,
    carrier.dataView,
    entryPointer,
    key
  );

  if (valuePointer === 0) {
    return undefined;
  }

  return entryToFinalJavaScriptValue(
    externalArgs,
    carrier,
    carrier.dataView.getUint32(valuePointer)
  );
}
