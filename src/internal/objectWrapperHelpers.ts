import { ObjectEntry, ObjectPropEntry, ExternalArgs } from "./interfaces";
import { readEntry, writeEntry } from "./store";
import { invariant } from "./utils";
import { ENTRY_TYPE } from "./entry-types";

export function deleteObjectPropertyEntryByKey(
  externalArgs: ExternalArgs,
  dataView: DataView,
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
  )[0] as ObjectEntry;

  if (objectEntry.value === 0) {
    // Nothing to delete here
    return false;
  }

  const firstPropEntry = readEntry(
    externalArgs,
    dataView,
    objectEntry.value
  )[0] as ObjectPropEntry;

  if (firstPropEntry.value.key === keyToDeleteBy) {
    writeEntry(externalArgs, dataView, containingObjectEntryPointer, {
      type: ENTRY_TYPE.OBJECT,
      value: firstPropEntry.value.next
    });

    return true;
  }

  let entryToMaybeUpdate = firstPropEntry;
  let entryToMaybeUpdatePointer = firstPropEntry.value.next;
  let entryToMaybeDelete: ObjectPropEntry | undefined;

  while (entryToMaybeUpdate.value.next !== 0) {
    entryToMaybeDelete = readEntry(
      externalArgs,
      dataView,
      entryToMaybeUpdate.value.next
    )[0] as ObjectPropEntry;

    if (entryToMaybeDelete.value.key === keyToDeleteBy) {
      break;
    }

    entryToMaybeUpdatePointer = entryToMaybeUpdate.value.next;
    entryToMaybeUpdate = entryToMaybeDelete;
  }

  if (entryToMaybeDelete && entryToMaybeDelete.value.key === keyToDeleteBy) {
    writeEntry(externalArgs, dataView, entryToMaybeUpdatePointer, {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        key: entryToMaybeUpdate.value.key,
        value: entryToMaybeUpdate.value.value,
        next: entryToMaybeDelete.value.next
      }
    });

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
  const [containingObjectEntry] = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as [ObjectEntry, number];

  if (containingObjectEntry.value === 0) {
    return [containingObjectEntryPointer, containingObjectEntry];
  }

  let nextElementPointer = containingObjectEntry.value;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [objectPropEntry] = readEntry(
      externalArgs,
      dataView,
      nextElementPointer
    ) as [ObjectPropEntry, number];

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
  const [containingObjectEntry] = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as [ObjectEntry, number];

  let currentPointer = containingObjectEntry.value;
  let objectPropEntry: ObjectPropEntry | undefined;

  if (containingObjectEntry.value === 0) {
    return undefined;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    [objectPropEntry] = readEntry(externalArgs, dataView, currentPointer) as [
      ObjectPropEntry,
      number
    ];

    if (objectPropEntry.value.key === key || objectPropEntry.value.next === 0) {
      break;
    }

    currentPointer = objectPropEntry.value.next;
  }

  if (objectPropEntry.value.key === key) {
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
  const [containingObjectEntry] = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as [ObjectEntry, number];

  let nextElementPointer = containingObjectEntry.value;
  let objectPropEntry: ObjectPropEntry | undefined;

  do {
    [objectPropEntry] = readEntry(
      externalArgs,
      dataView,
      nextElementPointer
    ) as [ObjectPropEntry, number];

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
  const [containingObjectEntry] = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as [ObjectEntry, number];

  const foundProps: ObjectPropEntry[] = [];

  let nextElementPointer = containingObjectEntry.value;
  let objectPropEntry: ObjectPropEntry | undefined;

  do {
    [objectPropEntry] = readEntry(
      externalArgs,
      dataView,
      nextElementPointer
    ) as [ObjectPropEntry, number];

    foundProps.push(objectPropEntry);

    nextElementPointer = objectPropEntry.value.next;
  } while (nextElementPointer !== 0);

  return foundProps;
}
