import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { Entry, primitive, GlobalCarrier } from "./interfaces";
import {
  isPrimitive,
  primitiveValueToEntry,
  isKnownAddressValuePointer
} from "./utils";
import { ExternalArgs } from "./interfaces";
import { BigInt64OverflowError } from "./exceptions";
import {
  INITIAL_ENTRY_POINTER_TO_POINTER,
  INITIAL_ENTRY_POINTER_VALUE
} from "./consts";
import { saveValue } from "./saveValue";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { stringEncodeInto } from "./stringEncodeInto";
import { stringDecode } from "./stringDecode";

const MAX_64_BIG_INT = BigInt("0xFFFFFFFFFFFFFFFF");

export function initializeArrayBuffer(arrayBuffer: ArrayBuffer) {
  const uint32 = new Uint32Array(arrayBuffer);

  uint32[0] = 0;
  uint32[
    INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
  ] = INITIAL_ENTRY_POINTER_VALUE;

  const dataView = new DataView(arrayBuffer);

  return dataView;
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
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
            allocatedBytes: entry.allocatedBytes
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }
}

export function appendEntry(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  entry: Entry
) {
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
    value: undefined as any
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
  value: any
) {
  const existingEntryPointer =
    carrier.uint32[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT];

  let reuse = false;
  let existingValueEntry: Entry | undefined;

  if (!isKnownAddressValuePointer(existingEntryPointer)) {
    existingValueEntry = readEntry(carrier, existingEntryPointer);
    reuse =
      isPrimitive(value) &&
      isPrimitiveEntryType(existingValueEntry.type) &&
      canReuseMemoryOfEntry(existingValueEntry, value);
  }

  // try to re use memory
  if (reuse) {
    const newEntry = primitiveValueToEntry(value);

    writeEntry(carrier, existingEntryPointer, newEntry);
  } else {
    const referencedPointers: number[] = [];
    const newEntryPointer = saveValue(
      externalArgs,
      carrier,
      referencedPointers,
      value
    );

    carrier.uint32[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT] = newEntryPointer;

    return {
      referencedPointers,
      existingEntryPointer,
      existingValueEntry
    };
  }
}

export function writeValueInPtrToPtrAndHandleMemory(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  ptrToPtr: number,
  value: any
) {
  const {
    existingValueEntry = false,
    existingEntryPointer = 0,
    referencedPointers = []
  } = writeValueInPtrToPtr(externalArgs, carrier, ptrToPtr, value) || {};

  if (referencedPointers.length > 0) {
    for (const ptr of referencedPointers) {
      incrementRefCount(externalArgs, carrier, ptr);
    }
  }

  if (existingValueEntry && "refsCount" in existingValueEntry) {
    const newRefCount = decrementRefCount(
      externalArgs,
      carrier,
      existingEntryPointer
    );

    if (newRefCount === 0) {
      const addressesToFree = getAllLinkedAddresses(
        carrier,
        false,
        existingEntryPointer
      );

      for (const address of addressesToFree.leafAddresses) {
        carrier.allocator.free(address);
      }

      for (const address of addressesToFree.arcAddresses) {
        decrementRefCount(externalArgs, carrier, address);
      }
    }
  } else {
    carrier.allocator.free(existingEntryPointer);
  }
}

export function handleArcForDeletedValuePointer(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  deletedValuePointer: number
): void {
  // No memory to free/ARC
  if (isKnownAddressValuePointer(deletedValuePointer)) {
    return;
  }

  const existingValueEntry = readEntry(carrier, deletedValuePointer);
  if (existingValueEntry && "refsCount" in existingValueEntry) {
    const newRefCount = decrementRefCount(
      externalArgs,
      carrier,
      deletedValuePointer
    );

    if (newRefCount === 0) {
      const addressesToFree = getAllLinkedAddresses(
        carrier,
        false,
        deletedValuePointer
      );

      for (const address of addressesToFree.leafAddresses) {
        carrier.allocator.free(address);
      }

      for (const address of addressesToFree.arcAddresses) {
        decrementRefCount(externalArgs, carrier, address);
      }
    }
  } else {
    carrier.allocator.free(deletedValuePointer);
  }
}

export function incrementRefCount(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  entryPointer: number
) {
  const entry = readEntry(carrier, entryPointer);

  if ("refsCount" in entry) {
    entry.refsCount += 1;
    writeEntry(carrier, entryPointer, entry);

    return entry.refsCount;
  }

  throw new Error("unexpected");
}

export function decrementRefCount(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  entryPointer: number
) {
  const entry = readEntry(carrier, entryPointer);

  if ("refsCount" in entry) {
    entry.refsCount -= 1;
    writeEntry(carrier, entryPointer, entry);

    return entry.refsCount;
  }

  throw new Error("unexpected");
}

// export function getObjectPropPtrToPtr(
//   { dataView }: GlobalCarrier,
//   pointerToEntry: number
// ) {
//   const keyStringLength = dataView.getUint16(pointerToEntry + 1);
//   const valuePtrToPtr =
//     Uint16Array.BYTES_PER_ELEMENT + pointerToEntry + 1 + keyStringLength;
//   const nextPtrToPtr = valuePtrToPtr + Uint32Array.BYTES_PER_ELEMENT;

//   return {
//     valuePtrToPtr,
//     nextPtrToPtr
//   };
// }

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
