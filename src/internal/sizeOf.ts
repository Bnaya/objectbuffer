import {
  ExternalArgsApi,
  ExternalArgs,
  ArrayEntry,
  ObjectPropEntry,
  ObjectEntry
} from "./interfaces";
import {
  externalArgsApiToExternalArgsApi,
  isPrimitive,
  primitiveValueToEntry
} from "./utils";
import { sizeOfEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";

/**
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
    length: arrayToSave.length
  };

  memoryAllocated += sizeOfEntry(externalArgs, arrayStartEntry);
  numberOfAllocations += 1;

  for (const item of arrayToSave) {
    const r = sizeOfValue(externalArgs, item);

    memoryAllocated += r.memoryAllocated;
    numberOfAllocations += r.numberOfAllocations;
  }

  return {
    memoryAllocated,
    numberOfAllocations
  };
}

export function sizeOfObject(
  externalArgs: ExternalArgs,
  objectToSave: any
): CheckerResult {
  let memoryAllocated = 0;
  let numberOfAllocations = 0;

  const objectEntries = Object.entries(objectToSave).reverse();

  for (const [key, value] of objectEntries) {
    const r = sizeOfValue(externalArgs, value);
    memoryAllocated += r.memoryAllocated;
    numberOfAllocations += r.numberOfAllocations;

    const objectPropEntry: ObjectPropEntry = {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        value: 0,
        key,
        next: 0
      }
    };

    const rOfPropEntry = sizeOfEntry(externalArgs, objectPropEntry);

    memoryAllocated += rOfPropEntry;
    numberOfAllocations += 1;
  }

  const objectStartEntry: ObjectEntry = {
    type: ENTRY_TYPE.OBJECT,
    refsCount: 0,
    value: 0
  };

  memoryAllocated += sizeOfEntry(externalArgs, objectStartEntry);
  numberOfAllocations += 1;

  return {
    memoryAllocated,
    numberOfAllocations
  };
}

export function sizeOfValue(
  externalArgs: ExternalArgs,
  value: any
): CheckerResult {
  if (isPrimitive(value)) {
    const entry = primitiveValueToEntry(
      externalArgs,
      value,
      externalArgs.minimumStringAllocation
    );

    return {
      memoryAllocated: sizeOfEntry(externalArgs, entry),
      numberOfAllocations: 1
    };
  } else if (Array.isArray(value)) {
    return sizeOfArray(externalArgs, value);
  } else if (value instanceof Date) {
    return {
      memoryAllocated: sizeOfEntry(externalArgs, {
        type: ENTRY_TYPE.DATE,
        refsCount: 0,
        value: value.getTime()
      }),
      numberOfAllocations: 1
    };
  } else if (typeof value === "object") {
    return sizeOfObject(externalArgs, value);
  } else {
    throw new Error("unsupported yet");
  }
}
