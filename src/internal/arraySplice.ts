import {
  getFinalValueAtArrayIndex,
  shrinkArray,
  extendArrayIfNeeded,
  setValuePointerAtArrayIndex,
  arrayGetPointerToIndex,
  arrayGetValuePointerInIndex,
} from "./arrayHelpers";
import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { handleArcForDeletedValuePointer, incrementRefCount } from "./store";
import { array_length_get } from "./generatedStructs";
import { saveValueIterativeReturnPointer } from "./saveValue";

/**
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice#Syntax
 */
export function arraySplice(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  pointerToArrayEntry: number,
  startArg: number,
  deleteCountArg?: number,
  ...itemsToAddArg: Array<any>
) {
  const arrayLength = array_length_get(carrier.heap, pointerToArrayEntry);

  const calcedStart = calculateSpliceStart(arrayLength, startArg);

  const calcedDeleteCount = calculateDeleteCount(
    arrayLength,
    calcedStart,
    deleteCountArg
  );

  const newLength = arrayLength + itemsToAddArg.length - calcedDeleteCount;
  const newValuesPointers: number[] = [];
  const referencedExistingPointers: number[] = [];

  for (let i = 0; i < itemsToAddArg.length; i += 1) {
    newValuesPointers.push(
      saveValueIterativeReturnPointer(
        externalArgs,
        carrier,
        referencedExistingPointers,
        itemsToAddArg[i]
      )
    );
  }

  extendArrayIfNeeded(externalArgs, carrier, pointerToArrayEntry, newLength);

  // from this point, no more allocations are expected
  // so means no OOMS

  if (referencedExistingPointers.length > 0) {
    for (const ptr of referencedExistingPointers) {
      incrementRefCount(carrier.heap, ptr);
    }
  }

  const deletedItemsToReturn = [];
  // can be negative
  const itemCountChange = newLength - arrayLength;

  for (
    let deletedItemIndexToSave = calcedStart;
    deletedItemIndexToSave < calcedStart + calcedDeleteCount;
    deletedItemIndexToSave += 1
  ) {
    deletedItemsToReturn.push(
      getFinalValueAtArrayIndex(
        externalArgs,
        carrier,
        pointerToArrayEntry,
        deletedItemIndexToSave
      )
    );
    // @todo hoist pointers map/set out of the loop
    handleArcForDeletedValuePointer(
      carrier,
      arrayGetValuePointerInIndex(
        carrier,
        pointerToArrayEntry,
        deletedItemIndexToSave
      )
    );
  }

  // copy-up items
  /**
    a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    a.splice(2, 2, "a", "b", "c")
    a; // [1, 2, "a", "b", "c", 5, 6, 7, 8, 9, 10]
   */
  if (itemCountChange > 0) {
    for (
      let writeValueToIndex = newLength - 1;
      writeValueToIndex >= calcedStart + itemCountChange;
      writeValueToIndex -= 1
    ) {
      const ptrToPtr = arrayGetPointerToIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex - itemCountChange
      );

      setValuePointerAtArrayIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex,
        carrier.heap.Uint32Array[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT]
      );

      carrier.heap.Uint32Array[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT] = 0;
    }
  }
  // copy-down items
  /*
      a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      a.splice(2, 2, "a")
      a; // [1, 2, "a", 5, 6, 7, 8, 9, 10]
  */
  else if (itemCountChange < 0) {
    for (
      let writeValueToIndex = calcedStart + itemsToAddArg.length;
      writeValueToIndex < arrayLength + itemCountChange;
      writeValueToIndex += 1
    ) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const valueToCopyPointer = arrayGetValuePointerInIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex - itemCountChange
      )!;

      setValuePointerAtArrayIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex,
        valueToCopyPointer
      );
    }
  }

  for (let i = 0; i < newValuesPointers.length; i += 1) {
    const pointerToThePointer = arrayGetPointerToIndex(
      carrier,
      pointerToArrayEntry,
      calcedStart + i
    );

    carrier.heap.Uint32Array[
      pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT
    ] = newValuesPointers[i];
  }

  if (newLength < arrayLength) {
    shrinkArray(carrier.heap, pointerToArrayEntry, newLength);
  }

  return deletedItemsToReturn;
}

function calculateSpliceStart(arrayLength: number, startArg: number) {
  return startArg >= arrayLength
    ? arrayLength
    : startArg < 0
    ? arrayLength + startArg
    : startArg;
}

function calculateDeleteCount(
  arrayLength: number,
  start: number,
  deleteCountArg?: number
): number {
  if (deleteCountArg === undefined || deleteCountArg >= arrayLength - start) {
    return Math.min(arrayLength, arrayLength - start);
  }

  if (deleteCountArg <= 0) {
    return 0;
  }

  return Math.min(arrayLength, deleteCountArg);
}
