import { readEntry, reserveMemory, writeEntry } from "./store";
import { ArrayEntry, ExternalArgs } from "./interfaces";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { saveValue } from "./saveValue";
import { ENTRY_TYPE } from "./entry-types";
import { assertNonNull } from "./assertNonNull";

export function arrayGetMetadata(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number
) {
  const [arrayEntry] = readEntry(
    externalArgs,
    dataView,
    pointerToArrayEntry
  ) as [ArrayEntry, number];

  return arrayEntry;
}

export function arrayGetPointersToValueInIndex(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const metadata = arrayGetMetadata(
    externalArgs,
    dataView,
    pointerToArrayEntry
  );

  // out of bound
  if (indexToGet >= metadata.length) {
    return undefined;
  }

  const pointerToThePointer =
    metadata.value + indexToGet * Uint32Array.BYTES_PER_ELEMENT;

  const pointer = dataView.getUint32(pointerToThePointer);

  return {
    pointer,
    pointerToThePointer
  };
}

export function getFinalValueAtArrayIndex(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const pointers = arrayGetPointersToValueInIndex(
    externalArgs,
    dataView,
    pointerToArrayEntry,
    indexToGet
  );

  if (pointers === undefined) {
    return undefined;
  }

  const entry = readEntry(externalArgs, dataView, pointers.pointer);

  return entryToFinalJavaScriptValue(
    externalArgs,
    dataView,
    entry[0],
    pointers.pointer
  );
}

export function setValuePointerAtArrayIndex(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  indexToSet: number,
  pointerToEntry: number
) {
  const pointers = arrayGetPointersToValueInIndex(
    externalArgs,
    dataView,
    pointerToArrayEntry,
    indexToSet
  );

  assertNonNull(pointers);

  dataView.setUint32(pointers.pointerToThePointer, pointerToEntry);
}

export function setValueAtArrayIndex(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  indexToSet: number,
  value: any
) {
  const saveValueResult = saveValue(externalArgs, dataView, value);

  setValuePointerAtArrayIndex(
    externalArgs,
    dataView,
    pointerToArrayEntry,
    indexToSet,
    saveValueResult.start
  );
}

/**
 * Will not shrink the array!
 */
export function extendArrayIfNeeded(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  wishedLength: number
) {
  const metadata = arrayGetMetadata(
    externalArgs,
    dataView,
    pointerToArrayEntry
  );

  if (wishedLength > metadata.length) {
    if (wishedLength > metadata.allocatedLength) {
      reallocateArray(
        externalArgs,
        dataView,
        pointerToArrayEntry,
        wishedLength + externalArgs.arrayAdditionalAllocation,
        wishedLength
      );
    } else {
      // no need to re-allocated, just push the length forward
      writeEntry(externalArgs, dataView, pointerToArrayEntry, {
        type: ENTRY_TYPE.ARRAY,
        value: metadata.value,
        allocatedLength: metadata.allocatedLength,
        length: wishedLength
      });
    }
  }
}

/**
 * Will not empty memory or relocate the array!
 */
export function shrinkArray(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  wishedLength: number
) {
  const metadata = arrayGetMetadata(
    externalArgs,
    dataView,
    pointerToArrayEntry
  );

  writeEntry(externalArgs, dataView, pointerToArrayEntry, {
    type: ENTRY_TYPE.ARRAY,
    value: metadata.value,
    allocatedLength: metadata.allocatedLength,
    length: wishedLength
  });
}

function reallocateArray(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  newAllocatedLength: number,
  newLength: number
) {
  const metadata = arrayGetMetadata(
    externalArgs,
    dataView,
    pointerToArrayEntry
  );

  const newArrayValueLocation = reserveMemory(
    dataView,
    newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT
  );

  for (
    let memoryToCopyIndex = 0;
    memoryToCopyIndex < metadata.length;
    memoryToCopyIndex += 1
  ) {
    dataView.setUint32(
      newArrayValueLocation + memoryToCopyIndex * Uint32Array.BYTES_PER_ELEMENT,
      dataView.getUint32(
        metadata.value + memoryToCopyIndex * Uint32Array.BYTES_PER_ELEMENT
      )
    );
  }

  writeEntry(externalArgs, dataView, pointerToArrayEntry, {
    type: ENTRY_TYPE.ARRAY,
    value: newArrayValueLocation,
    allocatedLength: newAllocatedLength,
    length: newLength
  });
}

export function arraySort(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number,
  sortComparator: (a: any, b: any) => 1 | -1 | 0 = defaultCompareFunction
) {
  const metadata = arrayGetMetadata(
    externalArgs,
    dataView,
    pointerToArrayEntry
  );
  const pointersToValues = [...new Array(metadata.length).keys()]
    .map(index => metadata.value + index * Uint32Array.BYTES_PER_ELEMENT)
    .map(pointerToPointer => dataView.getUint32(pointerToPointer));

  const sortMe = pointersToValues.map(pointer => {
    const entry = readEntry(externalArgs, dataView, pointer);

    return [
      pointer,
      entryToFinalJavaScriptValue(externalArgs, dataView, entry[0], pointer)
    ] as const;
  });

  sortMe.sort((a, b) => {
    return sortComparator(a[1], b[1]);
  });

  for (let i = 0; i < sortMe.length; i += 1) {
    dataView.setUint32(
      metadata.value + i * Uint32Array.BYTES_PER_ELEMENT,
      sortMe[i][0]
    );
  }
}

// https://stackoverflow.com/a/47349064/711152
function defaultCompareFunction(x: any, y: any) {
  //INFO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  //ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare

  if (x === undefined && y === undefined) return 0;

  if (x === undefined) return 1;

  if (y === undefined) return -1;

  const xString = toString(x);
  const yString = toString(y);

  if (xString < yString) return -1;

  if (xString > yString) return 1;

  return 0;
}

function toString(obj: any) {
  //ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-tostring

  if (obj === null) return "null";

  if (typeof obj === "boolean" || typeof obj === "number")
    return obj.toString();

  if (typeof obj === "string") return obj;

  if (typeof obj === "symbol") throw new TypeError();

  //we know we have an object. perhaps return JSON.stringify?
  return obj.toString();
}

export function arrayReverse(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToArrayEntry: number
) {
  const metadata = arrayGetMetadata(
    externalArgs,
    dataView,
    pointerToArrayEntry
  );

  for (let i = 0; i < Math.floor(metadata.length / 2); i += 1) {
    const theOtherIndex = metadata.length - i - 1;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const a = arrayGetPointersToValueInIndex(
      externalArgs,
      dataView,
      pointerToArrayEntry,
      i
    )!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const b = arrayGetPointersToValueInIndex(
      externalArgs,
      dataView,
      pointerToArrayEntry,
      theOtherIndex
    )!;

    setValuePointerAtArrayIndex(
      externalArgs,
      dataView,
      pointerToArrayEntry,
      i,
      b.pointer
    );

    setValuePointerAtArrayIndex(
      externalArgs,
      dataView,
      pointerToArrayEntry,
      theOtherIndex,
      a.pointer
    );
  }
}
