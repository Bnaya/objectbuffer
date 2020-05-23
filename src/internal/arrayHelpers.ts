import { writeValueInPtrToPtrAndHandleMemory } from "./store";
import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { ENTRY_TYPE } from "./entry-types";
import { assertNonNull } from "./assertNonNull";
import {
  array_length_get,
  array_dataspacePointer_get,
  array_allocatedLength_get,
  array_length_set,
  array_set_all,
  array_refsCount_get,
} from "./generatedStructs";
import { Heap } from "../structsGenerator/consts";

export function arrayGetPointersToValueInIndex(
  carrier: GlobalCarrier,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  // out of bound
  if (indexToGet >= array_length_get(carrier.heap, pointerToArrayEntry)) {
    return undefined;
  }

  const pointerToThePointer =
    array_dataspacePointer_get(carrier.heap, pointerToArrayEntry) +
    indexToGet * Uint32Array.BYTES_PER_ELEMENT;

  const pointer =
    carrier.uint32[pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT];

  return {
    pointer,
    pointerToThePointer,
  };
}

export function getFinalValueAtArrayIndex(
  externalArgs: ExternalArgs,
  globalCarrier: GlobalCarrier,
  pointerToArrayEntry: number,
  indexToGet: number
) {
  const pointers = arrayGetPointersToValueInIndex(
    globalCarrier,
    pointerToArrayEntry,
    indexToGet
  );

  if (pointers === undefined) {
    return undefined;
  }

  return entryToFinalJavaScriptValue(
    externalArgs,
    globalCarrier,
    pointers.pointer
  );
}

export function setValuePointerAtArrayIndex(
  carrier: GlobalCarrier,
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
  carrier.uint32[
    pointers.pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT
  ] = pointerToEntry;
}

export function setValueAtArrayIndex(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
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
  carrier: GlobalCarrier,
  pointerToArrayEntry: number,
  wishedLength: number
) {
  if (wishedLength > array_length_get(carrier.heap, pointerToArrayEntry)) {
    if (
      wishedLength >
      array_allocatedLength_get(carrier.heap, pointerToArrayEntry)
    ) {
      reallocateArray(
        carrier,
        pointerToArrayEntry,
        wishedLength + externalArgs.arrayAdditionalAllocation,
        wishedLength
      );
    } else {
      // no need to re-allocated, just push the length forward
      array_length_set(carrier.heap, pointerToArrayEntry, wishedLength);
    }
  }
}

/**
 * Will not empty memory or relocate the array!
 */
export function shrinkArray(
  heap: Heap,
  pointerToArrayEntry: number,
  wishedLength: number
) {
  array_length_set(heap, pointerToArrayEntry, wishedLength);
}

function reallocateArray(
  carrier: GlobalCarrier,
  pointerToArrayEntry: number,
  newAllocatedLength: number,
  newLength: number
): void {
  const dataspacePointer = array_dataspacePointer_get(
    carrier.heap,
    pointerToArrayEntry
  );

  // if array was zero length, dataspacePointer was zero
  const newArrayValueLocation =
    dataspacePointer !== 0
      ? carrier.allocator.realloc(
          dataspacePointer,
          newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT
        )
      : carrier.allocator.calloc(
          newAllocatedLength * Uint32Array.BYTES_PER_ELEMENT
        );

  array_set_all(
    carrier.heap,
    pointerToArrayEntry,
    ENTRY_TYPE.ARRAY,
    array_refsCount_get(carrier.heap, pointerToArrayEntry),
    newArrayValueLocation,
    newLength,
    newAllocatedLength
  );
}

export function arraySort(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  pointerToArrayEntry: number,
  sortComparator: (a: any, b: any) => 1 | -1 | 0 = defaultCompareFunction
) {
  const arrayDataSpace = array_dataspacePointer_get(
    carrier.heap,
    pointerToArrayEntry
  );
  const pointersToValues = [
    ...new Array(array_length_get(carrier.heap, pointerToArrayEntry)).keys(),
  ]
    .map((index) => arrayDataSpace + index * Uint32Array.BYTES_PER_ELEMENT)
    .map(
      (pointerToPointer) =>
        carrier.heap.Uint32Array[
          pointerToPointer / Uint32Array.BYTES_PER_ELEMENT
        ]
    );

  const sortMe = pointersToValues.map((pointer) => {
    return [
      pointer,
      entryToFinalJavaScriptValue(externalArgs, carrier, pointer),
    ] as const;
  });

  sortMe.sort((a, b) => {
    return sortComparator(a[1], b[1]);
  });

  for (let i = 0; i < sortMe.length; i += 1) {
    carrier.heap.Uint32Array[
      (arrayDataSpace + i * Uint32Array.BYTES_PER_ELEMENT) /
        Uint32Array.BYTES_PER_ELEMENT
    ] = sortMe[i][0];
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
  carrier: GlobalCarrier,
  pointerToArrayEntry: number
) {
  for (
    let i = 0;
    i < Math.floor(array_length_get(carrier.heap, pointerToArrayEntry) / 2);
    i += 1
  ) {
    const theOtherIndex =
      array_length_get(carrier.heap, pointerToArrayEntry) - i - 1;

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
