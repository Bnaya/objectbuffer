import { ExternalArgs, GlobalCarrier } from "./interfaces";
import {
  writeValueInPtrToPtrAndHandleMemory,
  handleArcForDeletedValuePointer,
  decrementRefCountWithNum,
} from "./store";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import {
  hashMapDelete,
  hashMapLowLevelIterator,
  hashMapInsertUpdate,
  hashMapValueLookup,
  createHashMap,
  hashMapNodePointerToKey,
  hashMapNodePointerToValue,
} from "./hashmap/hashmap";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import {
  typeOnly_type_get,
  number_value_get,
  typeAndRc_refsCount_get,
  typeAndRc_refsCount_set,
  object_pointerToHashMap_set,
} from "./generatedStructs";
import { ENTRY_TYPE } from "./entry-types";
import { readString } from "./readString";

export function deleteObjectPropertyEntryByKey(
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
    carrier.heap.Uint32Array[
      deletedValuePointerToPointer / Uint32Array.BYTES_PER_ELEMENT
    ];

  handleArcForDeletedValuePointer(carrier, deletedValuePointer);

  return true;
}

export function getObjectPropertiesEntries(
  carrier: GlobalCarrier,
  hashmapPointer: number
): Array<{ key: string | number; valuePointer: number }> {
  let iterator = 0;
  const foundValues: Array<{ key: string | number; valuePointer: number }> = [];

  while (
    (iterator = hashMapLowLevelIterator(carrier.heap, hashmapPointer, iterator))
  ) {
    const valuePointer = hashMapNodePointerToValue(iterator);
    const keyPointer = hashMapNodePointerToKey(carrier.heap, iterator);

    const typeOfKeyEntry:
      | ENTRY_TYPE.NUMBER
      | ENTRY_TYPE.STRING = typeOnly_type_get(carrier.heap, keyPointer);

    const key =
      typeOfKeyEntry === ENTRY_TYPE.NUMBER
        ? number_value_get(carrier.heap, keyPointer)
        : readString(carrier.heap, keyPointer);

    foundValues.push({
      valuePointer:
        carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT],
      key,
    });
  }

  return foundValues;
}

export function objectSet(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  hashMapPointer: number,
  p: string | number,
  value: unknown
) {
  carrier.allocator.transaction(() => {
    const ptrToPtr = hashMapInsertUpdate(
      externalArgs,
      carrier,
      hashMapPointer,
      p
    );

    writeValueInPtrToPtrAndHandleMemory(externalArgs, carrier, ptrToPtr, value);
  });
}

export function objectGet(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  entryPointer: number,
  key: string | number
) {
  const valuePointer = hashMapValueLookup(carrier.heap, entryPointer, key);

  return entryToFinalJavaScriptValue(
    externalArgs,
    carrier,
    carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT]
  );
}

// export function hashmapClearFree(
//   externalArgs: ExternalArgs,
//   carrier: GlobalCarrier,
//   hashmapPointer: number
// ) {
//   const leafAddresses = new Set<number>();

//   const addressesToProcessQueue: number[] = [];

//   getObjectOrMapOrSetAddresses(
//     carrier,
//     hashmapPointer,
//     leafAddresses,
//     addressesToProcessQueue
//   );

//   for (const address of leafAddresses) {
//     carrier.allocator.free(address);
//   }

//   for (const address of arcAddresses) {
//     decrementRefCount(externalArgs, carrier, address);
//   }
// }

export function mapOrSetClear(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  mapOrSetPtr: number
) {
  // we fake the entry refCount as zero so getAllLinkedAddresses will visit what's needed
  const prevCount = typeAndRc_refsCount_get(carrier.heap, mapOrSetPtr);
  typeAndRc_refsCount_set(carrier.heap, mapOrSetPtr, 0);

  const leafAddresses = new Set<number>();
  const arcAddresses = new Map<number, number>();

  getAllLinkedAddresses(
    carrier.heap,
    false,
    mapOrSetPtr,
    leafAddresses,
    arcAddresses
  );

  for (const address of leafAddresses) {
    // don't dispose the address we need to reuse
    if (address === mapOrSetPtr) {
      continue;
    }

    carrier.allocator.free(address);
  }

  for (const [address, count] of arcAddresses) {
    // don't dispose the address we need to reuse
    if (address === mapOrSetPtr) {
      continue;
    }

    decrementRefCountWithNum(carrier.heap, address, count);
  }

  // Restore real ref count
  typeAndRc_refsCount_set(carrier.heap, mapOrSetPtr, prevCount);
  object_pointerToHashMap_set(
    carrier.heap,
    mapOrSetPtr,
    createHashMap(carrier, externalArgs.hashMapMinInitialCapacity)
  );
}
