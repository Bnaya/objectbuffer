import {
  readEntry,
  writeEntry,
  writeValueInPtrToPtrAndHandleMemory
} from "./store";
import {
  ArrayEntry,
  ExternalArgs,
  DataViewAndAllocatorCarrier
} from "./interfaces";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { ENTRY_TYPE } from "./entry-types";
import { assertNonNull } from "./assertNonNull";

export function arrayGetMetadata(
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number
) {
  const arrayEntry = readEntry(carrier, pointerToArrayEntry) as ArrayEntry;

  return arrayEntry;
}

export function arrayGetPointersToValueInIndex(
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const metadata = arrayGetMetadata(carrier, pointerToArrayEntry);

  // out of bound
  if (indexToGet >= metadata.length) {
    return undefined;
  }

  const pointerToThePointer =
    metadata.value + indexToGet * Uint32Array.BYTES_PER_ELEMENT;

  const pointer = carrier.dataView.getUint32(pointerToThePointer);

  return {
    pointer,
    pointerToThePointer
  };
}

export function getFinalValueAtArrayIndex(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const pointers = arrayGetPointersToValueInIndex(
    dataViewCarrier,
    pointerToArrayEntry,
    indexToGet
  );

  if (pointers === undefined) {
    return undefined;
  }

  return entryToFinalJavaScriptValue(
    externalArgs,
    dataViewCarrier,
    pointers.pointer
  );
}

export function setValuePointerAtArrayIndex(
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  indexToSet: number,
  pointerToEntry: number
) {
  const pointers = arrayGetPointersToValueInIndex(
    carrier,
    pointerToArrayEntry,
    indexToSet
  );

  assertNonNull(pointers);

  carrier.dataView.setUint32(pointers.pointerToThePointer, pointerToEntry);
}

export function setValueAtArrayIndex(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  indexToSet: number,
  value: any
) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const pointers = arrayGetPointersToValueInIndex(
    carrier,
    pointerToArrayEntry,
    indexToSet
  )!;

  writeValueInPtrToPtrAndHandleMemory(
    externalArgs,
    carrier,
    pointers.pointerToThePointer,
    value
  );
}

/**
 * Will not shrink the array!
 */
export function extendArrayIfNeeded(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  wishedLength: number
) {
  const metadata = arrayGetMetadata(carrier, pointerToArrayEntry);

  if (wishedLength > metadata.length) {
    if (wishedLength > metadata.allocatedLength) {
      reallocateArray(
        externalArgs,
        carrier,
        pointerToArrayEntry,
        wishedLength + externalArgs.arrayAdditionalAllocation,
        wishedLength
      );
    } else {
      // no need to re-allocated, just push the length forward
      writeEntry(carrier, pointerToArrayEntry, {
        type: ENTRY_TYPE.ARRAY,
        refsCount: metadata.refsCount,
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
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  wishedLength: number
) {
  const metadata = arrayGetMetadata(carrier, pointerToArrayEntry);

  writeEntry(carrier, pointerToArrayEntry, {
    type: ENTRY_TYPE.ARRAY,
    refsCount: metadata.refsCount,
    value: metadata.value,
    allocatedLength: metadata.allocatedLength,
    length: wishedLength
  });
}

function reallocateArray(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  newAllocatedLength: number,
  newLength: number
) {
  const metadata = arrayGetMetadata(carrier, pointerToArrayEntry);

  const newArrayValueLocation = carrier.allocator.realloc(
    metadata.value,
    newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT
  );

  // for (
  //   let memoryToCopyIndex = 0;
  //   memoryToCopyIndex < metadata.length;
  //   memoryToCopyIndex += 1
  // ) {
  //   carrier.dataView.setUint32(
  //     newArrayValueLocation + memoryToCopyIndex * Uint32Array.BYTES_PER_ELEMENT,
  //     carrier.dataView.getUint32(
  //       metadata.value + memoryToCopyIndex * Uint32Array.BYTES_PER_ELEMENT
  //     )
  //   );
  // }

  writeEntry(carrier, pointerToArrayEntry, {
    type: ENTRY_TYPE.ARRAY,
    refsCount: metadata.refsCount,
    value: newArrayValueLocation,
    allocatedLength: newAllocatedLength,
    length: newLength
  });
}

export function arraySort(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number,
  sortComparator: (a: any, b: any) => 1 | -1 | 0 = defaultCompareFunction
) {
  const metadata = arrayGetMetadata(dataViewCarrier, pointerToArrayEntry);
  const pointersToValues = [...new Array(metadata.length).keys()]
    .map(index => metadata.value + index * Uint32Array.BYTES_PER_ELEMENT)
    .map(pointerToPointer =>
      dataViewCarrier.dataView.getUint32(pointerToPointer)
    );

  const sortMe = pointersToValues.map(pointer => {
    return [
      pointer,
      entryToFinalJavaScriptValue(externalArgs, dataViewCarrier, pointer)
    ] as const;
  });

  sortMe.sort((a, b) => {
    return sortComparator(a[1], b[1]);
  });

  for (let i = 0; i < sortMe.length; i += 1) {
    dataViewCarrier.dataView.setUint32(
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
  carrier: DataViewAndAllocatorCarrier,
  pointerToArrayEntry: number
) {
  const metadata = arrayGetMetadata(carrier, pointerToArrayEntry);

  for (let i = 0; i < Math.floor(metadata.length / 2); i += 1) {
    const theOtherIndex = metadata.length - i - 1;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const a = arrayGetPointersToValueInIndex(carrier, pointerToArrayEntry, i)!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const b = arrayGetPointersToValueInIndex(
      carrier,
      pointerToArrayEntry,
      theOtherIndex
    )!;

    setValuePointerAtArrayIndex(carrier, pointerToArrayEntry, i, b.pointer);

    setValuePointerAtArrayIndex(
      carrier,
      pointerToArrayEntry,
      theOtherIndex,
      a.pointer
    );
  }
}
