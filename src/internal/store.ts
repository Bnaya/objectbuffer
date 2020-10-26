import { ENTRY_TYPE } from "./entry-types";
import { GlobalCarrier } from "./interfaces";
import { isKnownAddressValuePointer, isTypeWithRC } from "./utils";
import { ExternalArgs } from "./interfaces";
import {
  INITIAL_ENTRY_POINTER_TO_POINTER,
  INITIAL_ENTRY_POINTER_VALUE,
} from "./consts";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import {
  typeAndRc_refsCount_get,
  typeAndRc_refsCount_set,
  typeOnly_type_get,
  number_value_get,
  string_bytesLength_get,
  string_charsPointer_get,
  string_size,
  string_set_all,
  number_set_all,
  number_size,
} from "./generatedStructs";
import type { Heap } from "../structsGenerator/consts";
import { readString } from "./readString";
import { saveValueIterative } from "./saveValue";
import { stringEncodeInto } from "./stringEncodeInto";
import { stringLengthV2 } from "./stringLengthV2";
import { OutOfMemoryError } from "./exceptions";

export function initializeArrayBuffer(arrayBuffer: ArrayBuffer) {
  const uint32 = new Uint32Array(arrayBuffer);

  uint32[0] = 0;
  uint32[
    INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
  ] = INITIAL_ENTRY_POINTER_VALUE;
}

export function freeStringOrNumber(
  { heap, allocator }: GlobalCarrier,
  stringOrNumberStructPointer: number
) {
  if (
    typeOnly_type_get(heap, stringOrNumberStructPointer) == ENTRY_TYPE.STRING
  ) {
    allocator.free(string_charsPointer_get(heap, stringOrNumberStructPointer));
  }

  allocator.free(stringOrNumberStructPointer);
}

export function saveStringOrNumber(
  carrier: GlobalCarrier,
  value: string | number
) {
  if (typeof value === "string") {
    return saveString(carrier, value);
  } else {
    return saveNumber(carrier, value);
  }
}

export function saveString({ heap, allocator }: GlobalCarrier, value: string) {
  const stringBytesLength = stringLengthV2(value);
  const stringDataPointer = allocator.calloc(stringBytesLength);
  stringEncodeInto(heap.u8, stringDataPointer, value);
  const stringPointer = allocator.calloc(string_size);

  string_set_all(
    heap,
    stringPointer,
    ENTRY_TYPE.STRING,
    1,
    stringBytesLength,
    stringDataPointer
  );

  return stringPointer;
}

export function saveNumber({ heap, allocator }: GlobalCarrier, value: number) {
  const numberPointer = allocator.calloc(number_size);

  number_set_all(heap, numberPointer, ENTRY_TYPE.NUMBER, value);

  return numberPointer;
}

export function writeValueInPtrToPtr(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  ptrToPtr: number,
  value: unknown
) {
  const referencedPointers: number[] = [];
  // Might oom here
  saveValueIterative(
    externalArgs,
    carrier,
    referencedPointers,
    ptrToPtr,
    value
  );

  return referencedPointers;
}

export function writeValueInPtrToPtrAndHandleMemory(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  ptrToPtr: number,
  value: unknown
) {
  const existingEntryPointer =
    carrier.heap.u32[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT];

  try {
    const referencedPointers = writeValueInPtrToPtr(
      externalArgs,
      carrier,
      ptrToPtr,
      value
    );

    // commit ref count changes of existing objects
    if (referencedPointers.length > 0) {
      for (const ptr of referencedPointers) {
        incrementRefCount(carrier.heap, ptr);
      }
    }

    handleArcForDeletedValuePointer(carrier, existingEntryPointer);
  } catch (ProbablyOutOfMemoryError) {
    if (ProbablyOutOfMemoryError instanceof OutOfMemoryError) {
      carrier.heap.u32[
        ptrToPtr / Uint32Array.BYTES_PER_ELEMENT
      ] = existingEntryPointer;
    }

    throw ProbablyOutOfMemoryError;
  }
}

export function handleArcForDeletedValuePointer(
  carrier: GlobalCarrier,
  deletedValuePointer: number
): void {
  const { heap, allocator } = carrier;
  // No memory to free/ARC
  if (isKnownAddressValuePointer(deletedValuePointer)) {
    return;
  }

  const entryType = typeOnly_type_get(heap, deletedValuePointer);
  if (!isTypeWithRC(entryType)) {
    allocator.free(deletedValuePointer);
    return;
  }

  const refCountAfterDec = decrementRefCount(heap, deletedValuePointer);
  if (refCountAfterDec > 0) {
    return;
  }

  const leafAddresses = new Set<number>();
  const arcAddresses = new Map<number, number>();

  getAllLinkedAddresses(
    carrier.heap,
    false,
    deletedValuePointer,
    leafAddresses,
    arcAddresses
  );

  handleLeafAddressesAndArcAddresses(carrier, leafAddresses, arcAddresses);
}

export function handleLeafAddressesAndArcAddresses(
  { heap, allocator }: GlobalCarrier,
  leafAddresses: Set<number>,
  arcAddresses: Map<number, number>
) {
  for (const address of leafAddresses) {
    allocator.free(address);
  }

  for (const [address, count] of arcAddresses) {
    decrementRefCountWithNum(heap, address, count);
  }
}

// export function collectArcDataForDeletedValuePointer(
//   carrier: GlobalCarrier,
//   deletedValuePointer: number,
//   leafAddresses: Set<number>,
//   arcAddresses: Map<number, number>
// ): void {
//   const { heap, allocator } = carrier;
//   // No memory to free/ARC
//   if (isKnownAddressValuePointer(deletedValuePointer)) {
//     return;
//   }

//   const entryType = typeOnly_type_get(heap, deletedValuePointer);
//   if (!isTypeWithRC(entryType)) {
//     allocator.free(deletedValuePointer);
//     return;
//   }

//   const refCountAfterDec = decrementRefCount(heap, deletedValuePointer);
//   if (refCountAfterDec > 0) {
//     return;
//   }

//   getAllLinkedAddresses(
//     carrier.heap,
//     false,
//     deletedValuePointer,
//     leafAddresses,
//     arcAddresses
//   );
// }

export function incrementRefCount(heap: Heap, entryPointer: number) {
  typeAndRc_refsCount_set(
    heap,
    entryPointer,
    typeAndRc_refsCount_get(heap, entryPointer) + 1
  );

  return typeAndRc_refsCount_get(heap, entryPointer);
}

export function decrementRefCount(heap: Heap, entryPointer: number) {
  typeAndRc_refsCount_set(
    heap,
    entryPointer,
    typeAndRc_refsCount_get(heap, entryPointer) - 1
  );

  return typeAndRc_refsCount_get(heap, entryPointer);
}

export function decrementRefCountWithNum(
  heap: Heap,
  entryPointer: number,
  num: number
) {
  typeAndRc_refsCount_set(
    heap,
    entryPointer,
    typeAndRc_refsCount_get(heap, entryPointer) - num
  );

  return typeAndRc_refsCount_get(heap, entryPointer);
}

export function getObjectValuePtrToPtr(pointerToEntry: number) {
  return pointerToEntry + 1 + 1;
}

export function memComp(
  uint8: Uint8Array,
  aStart: number,
  bStart: number,
  length: number
) {
  if (
    uint8.byteLength < aStart + length ||
    uint8.byteLength < bStart + length
  ) {
    return false;
  }
  for (let i = 0; i <= length - i; i += 1) {
    // compare 8 using Float64Array?
    if (uint8[aStart + i] !== uint8[bStart + i]) {
      return false;
    }
  }

  return true;
}

export function compareStringOrNumberEntriesInPlace(
  heap: Heap,
  entryAPointer: number,
  entryBPointer: number
) {
  typeOnly_type_get(heap, entryAPointer);
  const entryAType: ENTRY_TYPE.STRING | ENTRY_TYPE.NUMBER = typeOnly_type_get(
    heap,
    entryAPointer
  );

  const entryBType: ENTRY_TYPE.STRING | ENTRY_TYPE.NUMBER = typeOnly_type_get(
    heap,
    entryBPointer
  );

  if (entryAType !== entryBType) {
    return false;
  }

  if (entryAType === ENTRY_TYPE.STRING) {
    const aLength = string_bytesLength_get(heap, entryAPointer);
    const bLength = string_bytesLength_get(heap, entryBPointer);

    if (aLength !== bLength) {
      return false;
    }

    return memComp(
      heap.u8,
      string_charsPointer_get(heap, entryAPointer),
      string_charsPointer_get(heap, entryBPointer),
      aLength
    );
  }

  // numbers
  return (
    number_value_get(heap, entryAPointer) ===
    number_value_get(heap, entryBPointer)
  );
}

export function readNumberOrString(heap: Heap, pointer: number) {
  const type: ENTRY_TYPE.NUMBER | ENTRY_TYPE.STRING = typeOnly_type_get(
    heap,
    pointer
  );

  if (type === ENTRY_TYPE.NUMBER) {
    return number_value_get(heap, pointer);
  } else {
    return readString(heap, pointer);
  }
}
