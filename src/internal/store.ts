import { ENTRY_TYPE } from "./entry-types";
import { Entry, GlobalCarrier } from "./interfaces";
import { isKnownAddressValuePointer, isTypeWithRC } from "./utils";
import { ExternalArgs } from "./interfaces";
import { BigInt64OverflowError } from "./exceptions";
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
} from "./generatedStructs";
import { Heap } from "../structsGenerator/consts";
import { readString } from "./readString";
import { saveValueIterative } from "./saveValue";

const MAX_64_BIG_INT = BigInt("0xFFFFFFFFFFFFFFFF");

export function initializeArrayBuffer(arrayBuffer: ArrayBuffer) {
  const uint32 = new Uint32Array(arrayBuffer);

  uint32[0] = 0;
  uint32[
    INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
  ] = INITIAL_ENTRY_POINTER_VALUE;
}

export function sizeOfEntry(entry: Entry) {
  let cursor = 0;

  // type
  cursor += Float64Array.BYTES_PER_ELEMENT;

  switch (entry.type) {
    case ENTRY_TYPE.NUMBER:
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      // string length
      cursor += Uint32Array.BYTES_PER_ELEMENT;

      cursor += entry.allocatedBytes;

      // oh boy. i don't want to change it now, but no choice
      // @todo: this is incorrect? should be Math.max
      // cursor += entry.allocatedBytes;

      break;

    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      if (entry.value > MAX_64_BIG_INT || entry.value < -MAX_64_BIG_INT) {
        throw new BigInt64OverflowError();
      }

      cursor += BigInt64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      // ref count
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      // pointer
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      // refsCount
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      // pointer
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      // length
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      // allocated length
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.DATE:
      // timestamp
      cursor += Float64Array.BYTES_PER_ELEMENT;
      // ref count
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }

  return cursor;
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
    carrier.heap.Uint32Array[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT];
  // Might oom here
  const referencedPointers = writeValueInPtrToPtr(
    externalArgs,
    carrier,
    ptrToPtr,
    value
  );
  // -- end of might oom

  // commit ref count changes of existing objects
  if (referencedPointers.length > 0) {
    for (const ptr of referencedPointers) {
      incrementRefCount(carrier.heap, ptr);
    }
  }

  handleArcForDeletedValuePointer(carrier, existingEntryPointer);
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
    if (entryType === ENTRY_TYPE.STRING) {
      allocator.free(
        string_charsPointer_get(carrier.heap, deletedValuePointer)
      );
    }
    allocator.free(deletedValuePointer);
    return;
  }

  if (decrementRefCount(heap, deletedValuePointer) > 0) {
    allocator.free(deletedValuePointer);
    return;
  }

  const { leafAddresses, arcAddresses } = getAllLinkedAddresses(
    carrier,
    false,
    deletedValuePointer
  );

  for (const address of leafAddresses) {
    allocator.free(address);
  }

  for (const address of arcAddresses) {
    decrementRefCount(heap, address);
  }
}

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
      heap.Uint8Array,
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

export function compareStringOrNumberEntriesInPlaceOld(
  carrier: GlobalCarrier,
  entryAPointer: number,
  entryBPointer: number
) {
  let cursor = 0;
  const entryAType: ENTRY_TYPE =
    carrier.float64[(entryAPointer + cursor) / Float64Array.BYTES_PER_ELEMENT];
  const entryBType: ENTRY_TYPE =
    carrier.float64[(entryBPointer + cursor) / Float64Array.BYTES_PER_ELEMENT];
  cursor += Float64Array.BYTES_PER_ELEMENT;

  if (entryAType !== entryBType) {
    return false;
  }

  if (entryAType === ENTRY_TYPE.STRING) {
    const aLength =
      carrier.uint32[(entryAPointer + cursor) / Uint32Array.BYTES_PER_ELEMENT];
    const bLength =
      carrier.uint32[(entryBPointer + cursor) / Uint32Array.BYTES_PER_ELEMENT];

    if (aLength !== bLength) {
      return false;
    }

    // string length
    cursor += Uint32Array.BYTES_PER_ELEMENT;

    return memComp(
      carrier.uint8,
      entryAPointer + cursor,
      entryBPointer + cursor,
      aLength
    );
  }

  return (
    carrier.float64[
      (entryAPointer + cursor) / Float64Array.BYTES_PER_ELEMENT
    ] ===
    carrier.float64[(entryBPointer + cursor) / Float64Array.BYTES_PER_ELEMENT]
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
