import {
  getFinalValueAtArrayIndex,
  shrinkArray,
  extendArrayIfNeeded,
  arrayGetPointersToValueInIndex,
  setValuePointerAtArrayIndex,
} from "./arrayHelpers";
import { assertNonNull } from "./assertNonNull";
import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { writeValueInPtrToPtr, handleArcForDeletedValuePointer } from "./store";
import { array_length_get } from "./generatedStructs";

/**
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice#Syntax
  this function is not OOM same yet unfortunately,
  There's allocations after destructive mutations
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

  extendArrayIfNeeded(externalArgs, carrier, pointerToArrayEntry, newLength);

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
    handleArcForDeletedValuePointer(
      carrier,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      arrayGetPointersToValueInIndex(
        carrier,
        pointerToArrayEntry,
        deletedItemIndexToSave
      )!.pointer
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
      const valueToCopyPointers = arrayGetPointersToValueInIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex - itemCountChange
      );

      assertNonNull(valueToCopyPointers);

      setValuePointerAtArrayIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex,
        valueToCopyPointers.pointer
      );

      carrier.heap.Uint32Array[
        valueToCopyPointers.pointerToThePointer / Uint32Array.BYTES_PER_ELEMENT
      ] = 0;
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
      const valueToCopyPointers = arrayGetPointersToValueInIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex - itemCountChange
      )!;

      setValuePointerAtArrayIndex(
        carrier,
        pointerToArrayEntry,
        writeValueToIndex,
        valueToCopyPointers.pointer
      );
    }
  }

  for (let i = 0; i < itemsToAddArg.length; i += 1) {
    const valueToSetPointers = arrayGetPointersToValueInIndex(
      carrier,
      pointerToArrayEntry,
      calcedStart + i
    );

    assertNonNull(valueToSetPointers);

    writeValueInPtrToPtr(
      externalArgs,
      carrier,
      valueToSetPointers.pointerToThePointer,
      itemsToAddArg[i]
    );
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
