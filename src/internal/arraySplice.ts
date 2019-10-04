import {
  arrayGetMetadata,
  getFinalValueAtArrayIndex,
  setValueAtArrayIndex,
  shrinkArray,
  extendArrayIfNeeded,
  arrayGetPointersToValueInIndex,
  setValuePointerAtArrayIndex
} from "./arrayHelpers";
import { assertNonNull } from "./assertNonNull";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice#Syntax
export function arraySplice(
  dataView: DataView,
  textDecoder: any,
  textEncoder: any,
  arrayAdditionalAllocation: number,
  pointerToArrayEntry: number,
  startArg: number,
  deleteCountArg?: number,
  ...itemsToAddArg: Array<any>
) {
  const metadata = arrayGetMetadata(dataView, textDecoder, pointerToArrayEntry);

  const calcedStart = calculateSpliceStart(metadata.length, startArg);

  const calcedDeleteCount = calculateDeleteCount(
    metadata.length,
    calcedStart,
    deleteCountArg
  );

  const newLength = metadata.length + itemsToAddArg.length - calcedDeleteCount;

  extendArrayIfNeeded(
    dataView,
    textDecoder,
    textEncoder,
    pointerToArrayEntry,
    arrayAdditionalAllocation,
    newLength
  );

  const deletedItemsToReturn = [];
  // can be negative
  const itemCountChange = newLength - metadata.length;

  for (
    let deletedItemIndexToSave = calcedStart;
    deletedItemIndexToSave < calcedStart + calcedDeleteCount;
    deletedItemIndexToSave += 1
  ) {
    deletedItemsToReturn.push(
      getFinalValueAtArrayIndex(
        dataView,
        textDecoder,
        textEncoder,
        arrayAdditionalAllocation,
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
      const valueToCopyPointers = arrayGetPointersToValueInIndex(
        dataView,
        textDecoder,
        pointerToArrayEntry,
        writeValueToIndex - itemCountChange
      );

      assertNonNull(valueToCopyPointers);

      setValuePointerAtArrayIndex(
        dataView,
        textDecoder,
        pointerToArrayEntry,
        writeValueToIndex,
        valueToCopyPointers.pointer
      );
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
      writeValueToIndex < metadata.length + itemCountChange;
      writeValueToIndex += 1
    ) {
      const valueToCopyPointers = arrayGetPointersToValueInIndex(
        dataView,
        textDecoder,
        pointerToArrayEntry,
        writeValueToIndex - itemCountChange
      );

      assertNonNull(valueToCopyPointers);

      setValuePointerAtArrayIndex(
        dataView,
        textDecoder,
        pointerToArrayEntry,
        writeValueToIndex,
        valueToCopyPointers.pointer
      );

      // empty old array index, its still allocated!
      dataView.setUint32(valueToCopyPointers.pointerToThePointer, 0);

      // using that is wastefull
      // setValueAtArrayIndex(
      //   dataView,
      //   textDecoder,
      //   textEncoder,
      //   arrayAdditionalAllocation,
      //   pointerToArrayEntry,
      //   writeValueToIndex + calcedDeleteCount,
      //   undefined
      // );
    }
  }

  for (let i = 0; i < itemsToAddArg.length; i += 1) {
    setValueAtArrayIndex(
      dataView,
      textDecoder,
      textEncoder,
      arrayAdditionalAllocation,
      pointerToArrayEntry,
      calcedStart + i,
      itemsToAddArg[i]
    );
  }

  if (newLength < metadata.length) {
    shrinkArray(
      dataView,
      textDecoder,
      textEncoder,
      pointerToArrayEntry,
      newLength
    );
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
    return arrayLength - start;
  }

  if (deleteCountArg <= 0) {
    return 0;
  }

  return deleteCountArg;
}
