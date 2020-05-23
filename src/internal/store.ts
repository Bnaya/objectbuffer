import { ENTRY_TYPE } from "./entry-types";
import { Entry, primitive, GlobalCarrier } from "./interfaces";
import { isKnownAddressValuePointer, isTypeWithRC } from "./utils";
import { ExternalArgs } from "./interfaces";
import { BigInt64OverflowError } from "./exceptions";
import {
  INITIAL_ENTRY_POINTER_TO_POINTER,
  INITIAL_ENTRY_POINTER_VALUE,
} from "./consts";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { stringEncodeInto } from "./stringEncodeInto";
import { stringDecode } from "./stringDecode";
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

export function writeEntry(
  carrier: GlobalCarrier,
  startingCursor: number,
  entry: Entry
) {
  let cursor = startingCursor;

  // let writtenDataSizeInBytes = 0;

  // write type
  // undo on throw ?
  carrier.float64[cursor / Float64Array.BYTES_PER_ELEMENT] = entry.type;
  cursor += Float64Array.BYTES_PER_ELEMENT;

  switch (entry.type) {
    case ENTRY_TYPE.NUMBER:
      carrier.float64[cursor / Float64Array.BYTES_PER_ELEMENT] = entry.value;
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] =
        entry.allocatedBytes;
      cursor += Uint32Array.BYTES_PER_ELEMENT;

      // eslint-disable-next-line no-case-declarations
      const writtenBytes = stringEncodeInto(carrier.uint8, cursor, entry.value);

      if (writtenBytes !== entry.allocatedBytes) {
        // eslint-disable-next-line no-undef
        console.warn(
          {
            value: entry.value,
            writtenBytes,
            allocatedBytes: entry.allocatedBytes,
          },
          true
        );
        throw new Error("WTF???");
      }

      cursor += entry.allocatedBytes;

      break;

    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      if (entry.value > MAX_64_BIG_INT || entry.value < -MAX_64_BIG_INT) {
        throw new BigInt64OverflowError();
      }
      carrier.bigUint64[cursor / BigUint64Array.BYTES_PER_ELEMENT] =
        entry.type === ENTRY_TYPE.BIGINT_NEGATIVE ? -entry.value : entry.value;

      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.SET:
    case ENTRY_TYPE.MAP:
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] = entry.refsCount;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] = entry.value;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] = entry.refsCount;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] = entry.value;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] = entry.length;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] =
        entry.allocatedLength;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.DATE:
      carrier.float64[cursor / Float64Array.BYTES_PER_ELEMENT] = entry.value;
      cursor += Float64Array.BYTES_PER_ELEMENT;
      carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT] = entry.refsCount;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }
}

export function appendEntry(carrier: GlobalCarrier, entry: Entry) {
  const size = sizeOfEntry(entry);

  const memoryAddress = carrier.allocator.calloc(size);

  writeEntry(carrier, memoryAddress, entry);

  return memoryAddress;
}

export function readEntry(
  carrier: GlobalCarrier,
  startingCursor: number
): Entry {
  let cursor = startingCursor;

  const entryType: ENTRY_TYPE =
    carrier.float64[cursor / Float64Array.BYTES_PER_ELEMENT];
  cursor += Float64Array.BYTES_PER_ELEMENT;

  const entry: any = {
    type: entryType,
    value: undefined as any,
  };

  // let writtenDataSizeInBytes = 0;

  switch (entryType) {
    // handled by well-known addresses
    // case ENTRY_TYPE.UNDEFINED:
    //   break;

    // case ENTRY_TYPE.NULL:
    //   break;

    // case ENTRY_TYPE.BOOLEAN:
    //   entry.value = carrier.dataView.getUint8(cursor) !== 0;
    //   cursor += Uint8Array.BYTES_PER_ELEMENT;
    //   break;

    case ENTRY_TYPE.NUMBER:
      entry.value = carrier.float64[cursor / Float64Array.BYTES_PER_ELEMENT];
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      // eslint-disable-next-line no-case-declarations
      const stringLength =
        carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      entry.allocatedBytes = stringLength;
      cursor += Uint32Array.BYTES_PER_ELEMENT;

      // decode fails with zero length array
      if (stringLength > 0) {
        // this wrapping is needed until:
        // https://github.com/whatwg/encoding/issues/172
        // eslint-disable-next-line no-case-declarations
        // const tempAB = new ArrayBuffer(stringLength, true);
        // arrayBufferCopyTo(dataView.buffer, cursor, stringLength, tempAB, 0, true);

        entry.value = stringDecode(carrier.uint8, cursor, stringLength);
      } else {
        entry.value = "";
      }

      cursor += stringLength;

      break;

    case ENTRY_TYPE.BIGINT_POSITIVE:
      entry.value =
        carrier.bigUint64[cursor / BigUint64Array.BYTES_PER_ELEMENT];
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.BIGINT_NEGATIVE:
      entry.value = -carrier.bigUint64[
        cursor / BigUint64Array.BYTES_PER_ELEMENT
      ];
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      entry.refsCount = carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.value = carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      entry.refsCount = carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.value = carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.length = carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.allocatedLength =
        carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.DATE:
      entry.value = carrier.float64[cursor / Float64Array.BYTES_PER_ELEMENT];
      cursor += Float64Array.BYTES_PER_ELEMENT;
      entry.refsCount = carrier.uint32[cursor / Uint32Array.BYTES_PER_ELEMENT];
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    default:
      throw new Error(ENTRY_TYPE[entryType] + " Not implemented yet");
  }

  return entry;
}

export function canReuseMemoryOfEntry(entryA: Entry, value: primitive) {
  const typeofTheValue = typeof value;
  // number & bigint 64 are the same size
  if (
    (entryA.type === ENTRY_TYPE.BIGINT_NEGATIVE ||
      entryA.type === ENTRY_TYPE.BIGINT_POSITIVE ||
      entryA.type === ENTRY_TYPE.NUMBER) &&
    (typeofTheValue === "bigint" || typeofTheValue === "number")
  ) {
    return true;
  }

  // kill for strings for now
  // if (
  //   entryA.type === ENTRY_TYPE.STRING &&
  //   typeofTheValue === "string" &&
  //   entryA.allocatedBytes >= strByteLength(value as string)
  // ) {
  //   return true;
  // }

  return false;
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
  const existingEntryPointer = carrier.heap.Uint32Array[ptrToPtr];
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

  // I'm not sure how it gets undefind here
  if (existingEntryPointer !== undefined) {
    handleArcForDeletedValuePointer(carrier, existingEntryPointer);
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
