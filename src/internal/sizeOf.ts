/* istanbul ignore file */
import {
  ExternalArgsApi,
  ExternalArgs,
  ArrayEntry,
  ObjectEntry,
} from "./interfaces";
import {
  externalArgsApiToExternalArgsApi,
  isPrimitive,
  primitiveValueToEntry,
  align,
} from "./utils";
import { ENTRY_TYPE } from "./entry-types";
import {
  LINKED_LIST_MACHINE,
  LINKED_LIST_ITEM_MACHINE,
} from "./linkedList/linkedList";
import { MAP_MACHINE, NODE_MACHINE } from "./hashmap/memoryLayout";
import { sizeOfEntry } from "./store";

/**
 * **UNRELIABLE YET**
 *
 * Calculate the size (bytes) of the given value.
 * Also validates that the value is saveable
 */
export function sizeOf(externalArgs: ExternalArgsApi, value: any) {
  const temp = sizeOfValue(
    externalArgsApiToExternalArgsApi(externalArgs),
    value
  );

  return temp.memoryAllocated + temp.numberOfAllocations * 8;
}

interface CheckerResult {
  memoryAllocated: number;
  numberOfAllocations: number;
}

function sizeOfArray(
  externalArgs: ExternalArgs,
  arrayToSave: Array<any>
): CheckerResult {
  let memoryAllocated = 0;
  let numberOfAllocations = 0;

  memoryAllocated +=
    (arrayToSave.length + externalArgs.arrayAdditionalAllocation) *
    Uint32Array.BYTES_PER_ELEMENT;

  numberOfAllocations += 1;

  const arrayStartEntry: ArrayEntry = {
    type: ENTRY_TYPE.ARRAY,
    value: 0,
    refsCount: 0,
    allocatedLength:
      arrayToSave.length + externalArgs.arrayAdditionalAllocation,
    length: arrayToSave.length,
  };

  memoryAllocated += align(sizeOfEntry(arrayStartEntry));
  numberOfAllocations += 1;

  for (const item of arrayToSave) {
    const r = sizeOfValue(externalArgs, item);

    memoryAllocated += r.memoryAllocated;
    numberOfAllocations += r.numberOfAllocations;
  }

  return {
    memoryAllocated,
    numberOfAllocations,
  };
}

export function sizeOfObject(
  externalArgs: ExternalArgs,
  objectToSave: any
): CheckerResult {
  let memoryAllocated = 0;
  let numberOfAllocations = 0;

  const objectEntries = Object.entries(objectToSave);

  const r = sizeOfHashmap(
    externalArgs,
    objectEntries.map(([key]) => key)
  );

  memoryAllocated += r.memoryAllocated;
  numberOfAllocations += r.allocations;

  for (const [value] of objectEntries) {
    const r = sizeOfValue(externalArgs, value);
    memoryAllocated += r.memoryAllocated;
    numberOfAllocations += r.numberOfAllocations;
  }

  const objectStartEntry: ObjectEntry = {
    type: ENTRY_TYPE.OBJECT,
    refsCount: 0,
    value: 0,
  };

  memoryAllocated += align(sizeOfEntry(objectStartEntry));
  numberOfAllocations += 1;

  return {
    memoryAllocated,
    numberOfAllocations,
  };
}

export function sizeOfValue(
  externalArgs: ExternalArgs,
  value: any
): CheckerResult {
  if (
    value === undefined ||
    value === null ||
    value === true ||
    value === false
  ) {
    return {
      memoryAllocated: 0,
      numberOfAllocations: 0,
    };
  }

  if (isPrimitive(value)) {
    const entry = primitiveValueToEntry(value);

    return {
      memoryAllocated: align(sizeOfEntry(entry)),
      numberOfAllocations: 1,
    };
  } else if (Array.isArray(value)) {
    return sizeOfArray(externalArgs, value);
  } else if (value instanceof Date) {
    return {
      memoryAllocated: align(
        sizeOfEntry({
          type: ENTRY_TYPE.DATE,
          refsCount: 0,
          value: value.getTime(),
        })
      ),
      numberOfAllocations: 1,
    };
  } else if (typeof value === "object") {
    return sizeOfObject(externalArgs, value);
  } else {
    throw new Error("unsupported yet");
  }
}

// @todo what if rehash will happen on initial insert of value?
function sizeOfHashmap(
  externalArgs: ExternalArgs,
  keysArray: Array<string | number>
) {
  const linkedListBaseAllocationsSize =
    align(LINKED_LIST_MACHINE.map.SIZE_OF) +
    // end marker
    align(LINKED_LIST_ITEM_MACHINE.map.SIZE_OF);
  const linkedListBaseAllocations = 2;

  const linkedListItemsAllocations = keysArray.length;
  const linkedListItemsAllocationsSize =
    keysArray.length * align(LINKED_LIST_ITEM_MACHINE.map.SIZE_OF);

  const hashMapBaseAllocations = 2;
  const hashMapBaseAllocationsSize =
    align(MAP_MACHINE.map.SIZE_OF) +
    align(
      externalArgs.hashMapMinInitialCapacity * Uint32Array.BYTES_PER_ELEMENT
    );

  const hashMapNodesAllocations = keysArray.length;
  const hashMapNodesAllocationsSize =
    align(NODE_MACHINE.map.SIZE_OF) * keysArray.length;

  const hashMapKeysSize = keysArray
    .map((k) => sizeOfEntry(primitiveValueToEntry(k)))
    .reduce((p, c) => {
      return p + align(c);
    }, 0);

  return {
    allocations:
      linkedListBaseAllocations +
      linkedListItemsAllocations +
      hashMapBaseAllocations +
      hashMapNodesAllocations +
      keysArray.length,
    memoryAllocated:
      linkedListBaseAllocationsSize +
      linkedListItemsAllocationsSize +
      hashMapBaseAllocationsSize +
      hashMapNodesAllocationsSize +
      hashMapKeysSize,
  };
}
