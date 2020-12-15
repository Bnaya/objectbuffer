import { getOurPointerIfApplicable } from "./utils";
import type { ExternalArgs, GlobalCarrier } from "./interfaces";
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
  TEMP_SAVE_POINTER,
} from "./consts";
import { arraySaverIterative } from "./arraySaverIterative";
import {
  objectSaverIterative,
  mapSaverIterative,
  setSaverIterative,
} from "./objectSaverIterative";
import { stringEncodeInto } from "./stringEncodeInto";
import { stringLengthV2 } from "./stringLengthV2";

export function saveValueIterativeReturnPointer(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  referencedExistingPointers: number[],
  initialValue: unknown
) {
  saveValueIterative(
    externalArgs,
    carrier,
    referencedExistingPointers,
    TEMP_SAVE_POINTER,
    initialValue
  );

  const p = carrier.heap.u32[TEMP_SAVE_POINTER / Uint32Array.BYTES_PER_ELEMENT];
  carrier.heap.u32[TEMP_SAVE_POINTER / Uint32Array.BYTES_PER_ELEMENT] = 0;

  return p;
}

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
    heap: { u32 },
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
      u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = UNDEFINED_KNOWN_ADDRESS;
      continue;
    }

    if (valueToSave === null) {
      u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = NULL_KNOWN_ADDRESS;
      continue;
    }

    if (valueToSave === true) {
      u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = TRUE_KNOWN_ADDRESS;
      continue;
    }

    if (valueToSave === false) {
      u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = FALSE_KNOWN_ADDRESS;
      continue;
    }

    if (savedValuesToPointer.has(valueToSave)) {
      u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ] = savedValuesToPointer.get(valueToSave)!;
      referencedExistingPointers.push(
        u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );

      continue;
    }

    switch (typeof valueToSave) {
      case "number":
        u32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = allocator.calloc(number_size);
        number_set_all(
          heap,
          u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
          ENTRY_TYPE.NUMBER,
          valueToSave
        );
        continue;

      case "string":
        // eslint-disable-next-line no-case-declarations
        const stringBytesLength = stringLengthV2(valueToSave);
        // eslint-disable-next-line no-case-declarations
        const stringDataPointer = allocator.calloc(stringBytesLength);
        u32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = allocator.calloc(string_size);

        // if (
        stringEncodeInto(
          heap.u8,
          stringDataPointer,
          valueToSave
        ); /*!==
          stringBytesLength;*/
        // ) {
        //   console.warn("bad str length");
        // }

        string_set_all(
          heap,
          u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
          ENTRY_TYPE.STRING,
          1,
          stringBytesLength,
          stringDataPointer
        );

        savedValuesToPointer.set(
          valueToSave,
          u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
        );
        continue;

      case "bigint":
        if (valueToSave > MAX_64_BIG_INT || valueToSave < -MAX_64_BIG_INT) {
          u32[
            ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
          ] = UNDEFINED_KNOWN_ADDRESS;
          continue;
          // todo Maybe don't make undefined but throw, or clamp
        }

        u32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = allocator.calloc(bigint_size);
        bigint_set_all(
          heap,
          u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
          valueToSave > 0
            ? ENTRY_TYPE.BIGINT_POSITIVE
            : ENTRY_TYPE.BIGINT_NEGATIVE,
          valueToSave * (valueToSave > 0 ? BigInt("1") : BigInt("-1"))
        );

        continue;

      case "function":
        // todo Nope Nope Nope
        u32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = UNDEFINED_KNOWN_ADDRESS;
        continue;

      case "symbol":
        // todo not supported, write undefined
        u32[
          ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
        ] = UNDEFINED_KNOWN_ADDRESS;
        continue;
    }

    const maybeOurPointerFromSymbol = getOurPointerIfApplicable(
      valueToSave,
      carrier.allocator
    );

    if (maybeOurPointerFromSymbol) {
      referencedExistingPointers.push(maybeOurPointerFromSymbol);
      heap.u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = maybeOurPointerFromSymbol;
      continue;
    }

    if (Array.isArray(valueToSave)) {
      heap.u32[
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
        u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    if (valueToSave instanceof Date) {
      heap.u32[
        ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT
      ] = allocator.calloc(date_size);
      date_set_all(
        heap,
        heap.u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT],
        ENTRY_TYPE.DATE,
        1,
        0,
        valueToSave.getTime()
      );

      savedValuesToPointer.set(
        valueToSave,
        u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    if (valueToSave instanceof Map) {
      heap.u32[
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
        u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    if (valueToSave instanceof Set) {
      heap.u32[
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
        u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
      );
      continue;
    }

    // Plain object? I hope so
    heap.u32[
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
      u32[ptrToPtrToSaveTo / Uint32Array.BYTES_PER_ELEMENT]
    );
  }
}
