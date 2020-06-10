import { getOurPointerIfApplicable } from "./utils";
import { ExternalArgs, GlobalCarrier } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import {
  number_size,
  number_set_all,
  bigint_size,
  bigint_set_all,
  string_size,
  string_set_all,
  date_size,
  date_set_all,
} from "./generatedStructs";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS,
  MAX_64_BIG_INT,
} from "./consts";
import { arraySaverIterative } from "./arraySaverIterative";
import {
  objectSaverIterative,
  mapSaverIterative,
  setSaverIterative,
} from "./objectSaverIterative";
import { stringEncodeInto } from "./stringEncodeInto";
import { stringLengthV2 } from "./stringLengthV2";

export function saveValueIterative(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  referencedExistingPointers: number[],
  initialValuePtrToPtr: number,
  initialValue: unknown
) {
  const valuesToSave = [initialValue];
  const pointersToSaveTo = [initialValuePtrToPtr];
  const savedValuesToPointer = new Map<unknown, number>();
  // const savedValuesRefCount = new Map<unknown, number>();

  const {
    heap: { Uint32Array: uint32 },
    allocator,
    heap,
  } = carrier;

  while (valuesToSave.length !== 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const valueToSave = valuesToSave.pop()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ptrToPtrToSaveTo = pointersToSaveTo.pop()!;

    // Handler well-known values
    if (valueToSave === undefined) {
      uint32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = UNDEFINED_KNOWN_ADDRESS;
      continue;
    }

    if (valueToSave === null) {
      uint32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = NULL_KNOWN_ADDRESS;
      continue;
    }

    if (valueToSave === true) {
      uint32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = TRUE_KNOWN_ADDRESS;
      continue;
    }

    if (valueToSave === false) {
      uint32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = FALSE_KNOWN_ADDRESS;
      continue;
    }

    if (savedValuesToPointer.has(valueToSave)) {
      uint32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ] = savedValuesToPointer.get(valueToSave)!;
      referencedExistingPointers.push(
        uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );

      continue;
    }

    switch (typeof valueToSave) {
      case "number":
        uint32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = allocator.calloc(number_size);
        number_set_all(
          heap,
          uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
          ENTRY_TYPE.NUMBER,
          valueToSave
        );
        continue;

      case "string":
        // eslint-disable-next-line no-case-declarations
        const stringBytesLength = stringLengthV2(valueToSave);
        // eslint-disable-next-line no-case-declarations
        const stringDataPointer = allocator.calloc(stringBytesLength);
        uint32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = allocator.calloc(string_size);

        // if (
        stringEncodeInto(
          heap.Uint8Array,
          stringDataPointer,
          valueToSave
        ); /*!==
          stringBytesLength;*/
        // ) {
        //   console.warn("bad str length");
        // }

        string_set_all(
          heap,
          uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
          ENTRY_TYPE.STRING,
          1,
          stringBytesLength,
          stringDataPointer
        );

        savedValuesToPointer.set(
          valueToSave,
          uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
        );
        continue;

      case "bigint":
        if (valueToSave > MAX_64_BIG_INT || valueToSave < -MAX_64_BIG_INT) {
          uint32[
            ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
          ] = UNDEFINED_KNOWN_ADDRESS;
          continue;
          // Maybe don't make undefined but throw, or clamp
          // throw new Error("MAX_64_BIG_INT");
        }

        uint32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = allocator.calloc(bigint_size);
        bigint_set_all(
          heap,
          uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
          valueToSave > 0
            ? ENTRY_TYPE.BIGINT_POSITIVE
            : ENTRY_TYPE.BIGINT_NEGATIVE,
          valueToSave * (valueToSave > 0 ? BigInt("1") : BigInt("-1"))
        );

        continue;

      case "function":
        // Nope Nope Nope
        uint32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = UNDEFINED_KNOWN_ADDRESS;
        continue;

      case "symbol":
        // not supported, write undefined
        uint32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = UNDEFINED_KNOWN_ADDRESS;
        continue;

      // // we will never get here
      // case "undefined":
      //   continue;
      // // we will never get here
      // case "boolean":
      //   continue;
    }

    const maybeOurPointerFromSymbol = getOurPointerIfApplicable(
      valueToSave,
      carrier.allocator
    );

    if (maybeOurPointerFromSymbol) {
      referencedExistingPointers.push(maybeOurPointerFromSymbol);
      heap.Uint32Array[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = maybeOurPointerFromSymbol;
      continue;
    }

    if (Array.isArray(valueToSave)) {
      heap.Uint32Array[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = arraySaverIterative(
        externalArgs.arrayAdditionalAllocation,
        carrier,
        valuesToSave,
        pointersToSaveTo,
        valueToSave
      );

      savedValuesToPointer.set(
        valueToSave,
        uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    if (valueToSave instanceof Date) {
      heap.Uint32Array[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = allocator.calloc(date_size);
      date_set_all(
        heap,
        heap.Uint32Array[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
        ENTRY_TYPE.DATE,
        1,
        0,
        valueToSave.getTime()
      );

      savedValuesToPointer.set(
        valueToSave,
        uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    if (valueToSave instanceof Map) {
      heap.Uint32Array[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = mapSaverIterative(
        externalArgs,
        carrier,
        valuesToSave,
        pointersToSaveTo,
        savedValuesToPointer,
        referencedExistingPointers,
        valueToSave
      );

      savedValuesToPointer.set(
        valueToSave,
        uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    if (valueToSave instanceof Set) {
      heap.Uint32Array[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = setSaverIterative(
        externalArgs,
        carrier,
        savedValuesToPointer,
        referencedExistingPointers,
        valueToSave
      );

      savedValuesToPointer.set(
        valueToSave,
        uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    // Plain object? I hope so
    heap.Uint32Array[
      ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
    ] = objectSaverIterative(
      externalArgs,
      carrier,
      valuesToSave,
      pointersToSaveTo,
      savedValuesToPointer,
      referencedExistingPointers,
      valueToSave
    );

    savedValuesToPointer.set(
      valueToSave,
      uint32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
    );
  }
}
