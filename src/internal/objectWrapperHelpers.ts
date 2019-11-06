import {
  ObjectEntry,
  ObjectPropEntry,
  ExternalArgs,
  DataViewAndAllocatorCarrier
} from "./interfaces";
import {
  readEntry,
  writeEntry,
  appendEntry,
  getObjectPropPtrToPtr,
  writeValueInPtrToPtrAndHandleMemory
} from "./store";
import { invariant } from "./utils";
import { ENTRY_TYPE } from "./entry-types";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { saveValue } from "./saveValue";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";

export function deleteObjectPropertyEntryByKey(
  externalArgs: ExternalArgs,
  { dataView, allocator }: DataViewAndAllocatorCarrier,
  containingObjectEntryPointer: number,
  keyToDeleteBy: string
): boolean {
  invariant(
    containingObjectEntryPointer !== 0,
    "containingObjectEntryPointer Must not be 0"
  );

  const objectEntry = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as ObjectEntry;

  if (objectEntry.value === 0) {
    // Nothing to delete here
    return false;
  }

  const firstPropEntry = readEntry(
    externalArgs,
    dataView,
    objectEntry.value
  ) as ObjectPropEntry;

  if (firstPropEntry.value.key === keyToDeleteBy) {
    writeEntry(externalArgs, dataView, containingObjectEntryPointer, {
      type: ENTRY_TYPE.OBJECT,
      refsCount: objectEntry.refsCount,
      value: firstPropEntry.value.next
    });

    const addressesToFree = getAllLinkedAddresses(
      externalArgs,
      dataView,
      false,
      objectEntry.value
    );

    for (const address of addressesToFree) {
      allocator.free(address);
    }

    return true;
  }

  let entryToMaybeUpdate = firstPropEntry;
  let entryToMaybeUpdatePointer = firstPropEntry.value.next;
  let entryToMaybeDelete: ObjectPropEntry | undefined;
  let entryToMaybeDeletePointer: number | undefined;

  while (entryToMaybeUpdate.value.next !== 0) {
    entryToMaybeDeletePointer = entryToMaybeUpdate.value.next;
    entryToMaybeDelete = readEntry(
      externalArgs,
      dataView,
      entryToMaybeDeletePointer
    ) as ObjectPropEntry;

    if (entryToMaybeDelete.value.key === keyToDeleteBy) {
      break;
    }

    entryToMaybeUpdatePointer = entryToMaybeDeletePointer;
    entryToMaybeUpdate = entryToMaybeDelete;
  }

  if (
    entryToMaybeDelete &&
    entryToMaybeDeletePointer &&
    entryToMaybeDelete.value.key === keyToDeleteBy
  ) {
    writeEntry(externalArgs, dataView, entryToMaybeUpdatePointer, {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        key: entryToMaybeUpdate.value.key,
        value: entryToMaybeUpdate.value.value,
        next: entryToMaybeDelete.value.next
      }
    });

    const addressesToFree = getAllLinkedAddresses(
      externalArgs,
      dataView,
      false,
      entryToMaybeDeletePointer
    );

    for (const address of addressesToFree) {
      allocator.free(address);
    }
    return true;
  } else {
    // key not found
    return false;
  }

  // Nothing to delete
}

/**
 * If the object has no props, return the object pointer itself
 * @param dataView
 * @param containingObjectEntryPointer
 * @param textDecoder
 */
export function findLastObjectPropertyEntry(
  externalArgs: ExternalArgs,
  dataView: DataView,
  containingObjectEntryPointer: number
): [number, ObjectPropEntry | ObjectEntry] {
  const containingObjectEntry = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as ObjectEntry;

  if (containingObjectEntry.value === 0) {
    return [containingObjectEntryPointer, containingObjectEntry];
  }

  let nextElementPointer = containingObjectEntry.value;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const objectPropEntry = readEntry(
      externalArgs,
      dataView,
      nextElementPointer
    ) as ObjectPropEntry;

    if (objectPropEntry.value.next === 0) {
      return [nextElementPointer, objectPropEntry];
    }

    nextElementPointer = objectPropEntry.value.next;
  }
}

export function findObjectPropertyEntry(
  externalArgs: ExternalArgs,
  dataView: DataView,
  containingObjectEntryPointer: number,
  key: string
): [number, ObjectPropEntry] | undefined {
  const containingObjectEntry = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as ObjectEntry;

  let currentPointer = containingObjectEntry.value;
  let objectPropEntry: ObjectPropEntry | undefined;

  // eslint-disable-next-line no-constant-condition
  while (currentPointer !== 0) {
    objectPropEntry = readEntry(
      externalArgs,
      dataView,
      currentPointer
    ) as ObjectPropEntry;

    if (objectPropEntry.value.key === key || objectPropEntry.value.next === 0) {
      break;
    }

    currentPointer = objectPropEntry.value.next;
  }

  if (objectPropEntry && objectPropEntry.value.key === key) {
    return [currentPointer, objectPropEntry];
  }

  return undefined;
}

export function findObjectPropertyEntryOld(
  externalArgs: ExternalArgs,
  dataView: DataView,
  containingObjectEntryPointer: number,
  key: string
): ObjectPropEntry | undefined {
  const containingObjectEntry = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as ObjectEntry;

  if (containingObjectEntry.value === 0) {
    return undefined;
  }

  let nextElementPointer = containingObjectEntry.value;
  let objectPropEntry: ObjectPropEntry | undefined;

  do {
    objectPropEntry = readEntry(
      externalArgs,
      dataView,
      nextElementPointer
    ) as ObjectPropEntry;

    nextElementPointer = objectPropEntry.value.next;
  } while (objectPropEntry.value.key !== key && nextElementPointer !== 0);

  if (objectPropEntry.value.key === key) {
    return objectPropEntry;
  }

  return undefined;
}

export function getObjectPropertiesEntries(
  externalArgs: ExternalArgs,
  dataView: DataView,
  containingObjectEntryPointer: number
): ObjectPropEntry[] {
  const containingObjectEntry = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as ObjectEntry;

  const foundProps: ObjectPropEntry[] = [];

  let nextElementPointer = containingObjectEntry.value;
  let objectPropEntry: ObjectPropEntry | undefined;

  if (nextElementPointer === 0) {
    return [];
  }

  do {
    objectPropEntry = readEntry(
      externalArgs,
      dataView,
      nextElementPointer
    ) as ObjectPropEntry;

    foundProps.push(objectPropEntry);

    nextElementPointer = objectPropEntry.value.next;
  } while (nextElementPointer !== 0);

  return foundProps;
}

export function objectSet(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  entryPointer: number,
  p: string,
  value: any
) {
  const foundPropEntry = findObjectPropertyEntry(
    externalArgs,
    carrier.dataView,
    entryPointer,
    p
  );

  const refrencedPointers: number[] = [];

  // new prop
  if (foundPropEntry === undefined) {
    const newValueEntryPointer = saveValue(
      externalArgs,
      carrier,
      refrencedPointers,
      value
    );

    const newPropEntryPointer = appendEntry(externalArgs, carrier, {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        next: 0,
        value: newValueEntryPointer,
        key: p
      }
    });

    const [lastItemPointer, lastItemEntry] = findLastObjectPropertyEntry(
      externalArgs,
      carrier.dataView,
      entryPointer
    );

    if (lastItemEntry.type === ENTRY_TYPE.OBJECT) {
      writeEntry(externalArgs, carrier.dataView, lastItemPointer, {
        type: ENTRY_TYPE.OBJECT,
        refsCount: lastItemEntry.refsCount,
        value: newPropEntryPointer
      });
    } else {
      writeEntry(externalArgs, carrier.dataView, lastItemPointer, {
        type: ENTRY_TYPE.OBJECT_PROP,
        value: {
          next: newPropEntryPointer,
          value: lastItemEntry.value.value,
          key: lastItemEntry.value.key
        }
      });
    }
  } else {
    writeValueInPtrToPtrAndHandleMemory(
      externalArgs,
      carrier,
      getObjectPropPtrToPtr(carrier, foundPropEntry[0]).valuePtrToPtr,
      value
    );
  }
}

export function objectGet(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewAndAllocatorCarrier,
  entryPointer: number,
  p: string
) {
  const foundEntry = findObjectPropertyEntry(
    externalArgs,
    dataViewCarrier.dataView,
    entryPointer,
    p
  );

  if (foundEntry === undefined) {
    return undefined;
  }

  const valueEntry = readEntry(
    externalArgs,
    dataViewCarrier.dataView,
    foundEntry[1].value.value
  );

  return entryToFinalJavaScriptValue(
    externalArgs,
    dataViewCarrier,
    valueEntry,
    foundEntry[1].value.value
  );
}
