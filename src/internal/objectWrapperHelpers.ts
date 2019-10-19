import { ObjectEntry, ObjectPropEntry, ExternalArgs } from "./interfaces";
import {
  readEntry,
  writeEntry,
  appendEntry,
  overwriteEntryIfPossible
} from "./store";
import { invariant } from "./utils";
import { ENTRY_TYPE } from "./entry-types";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { saveValue } from "./saveValue";

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

  // eslint-disable-next-line no-constant-condition
  while (currentPointer !== 0) {
    [objectPropEntry] = readEntry(externalArgs, dataView, currentPointer) as [
      ObjectPropEntry,
      number
    ];

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
  const [containingObjectEntry] = readEntry(
    externalArgs,
    dataView,
    containingObjectEntryPointer
  ) as [ObjectEntry, number];

  if (containingObjectEntry.value === 0) {
    return undefined;
  }

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

  if (nextElementPointer === 0) {
    return [];
  }

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

export function objectSet(
  externalArgs: ExternalArgs,
  dataView: DataView,
  entryPointer: number,
  p: string,
  value: any
) {
  const foundPropEntry = findObjectPropertyEntry(
    externalArgs,
    dataView,
    entryPointer,
    p as string
  );

  // new prop
  if (foundPropEntry === undefined) {
    const { start: newValueEntryPointer } = saveValue(
      externalArgs,
      dataView,
      value
    );

    const { start: newPropEntryPointer } = appendEntry(externalArgs, dataView, {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        next: 0,
        value: newValueEntryPointer,
        key: p as string
      }
    });

    const [lastItemPointer, lastItemEntry] = findLastObjectPropertyEntry(
      externalArgs,
      dataView,
      entryPointer
    );

    if (lastItemEntry.type === ENTRY_TYPE.OBJECT) {
      writeEntry(externalArgs, dataView, lastItemPointer, {
        type: ENTRY_TYPE.OBJECT,
        value: newPropEntryPointer
      });
    } else {
      writeEntry(externalArgs, dataView, lastItemPointer, {
        type: ENTRY_TYPE.OBJECT_PROP,
        value: {
          next: newPropEntryPointer,
          value: lastItemEntry.value.value,
          key: lastItemEntry.value.key
        }
      });
    }
  } else {
    if (
      !overwriteEntryIfPossible(
        externalArgs,
        dataView,
        foundPropEntry[1].value.value,
        value
      )
    ) {
      const { start: newValueEntryPointer } = saveValue(
        externalArgs,
        dataView,
        value
      );

      // overwrite value
      writeEntry(externalArgs, dataView, foundPropEntry[0], {
        type: ENTRY_TYPE.OBJECT_PROP,
        value: {
          key: foundPropEntry[1].value.key,
          next: foundPropEntry[1].value.next,
          value: newValueEntryPointer
        }
      });
    }
  }
}

export function objectGet(
  externalArgs: ExternalArgs,
  dataView: DataView,
  entryPointer: number,
  p: string
) {
  const foundEntry = findObjectPropertyEntry(
    externalArgs,
    dataView,
    entryPointer,
    p
  );

  if (foundEntry === undefined) {
    return undefined;
  }

  const [valueEntry] = readEntry(
    externalArgs,
    dataView,
    foundEntry[1].value.value
  );

  return entryToFinalJavaScriptValue(
    externalArgs,
    dataView,
    valueEntry,
    foundEntry[1].value.value
  );
}
