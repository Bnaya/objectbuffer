import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { Entry, primitive, DataViewAndAllocatorCarrier } from "./interfaces";
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
  const dataView = new DataView(arrayBuffer);

  // global lock
  dataView.setInt32(0, 0);

  // first entry pointer
  dataView.setUint32(
    INITIAL_ENTRY_POINTER_TO_POINTER,
    INITIAL_ENTRY_POINTER_VALUE
  );

  return dataView;
}

export function sizeOfEntry(entry: Entry) {
  let cursor = 0;

  cursor += Uint8Array.BYTES_PER_ELEMENT;

  switch (entry.type) {
    case ENTRY_TYPE.NUMBER:
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      cursor += Uint16Array.BYTES_PER_ELEMENT;

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
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.DATE:
      cursor += Float64Array.BYTES_PER_ELEMENT;
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }

  return cursor;
}

export function writeEntry(
  { dataView, uint8 }: DataViewAndAllocatorCarrier,
  startingCursor: number,
  entry: Entry
) {
  let cursor = startingCursor;

  // let writtenDataSizeInBytes = 0;

  // write type
  // undo on throw ?
  dataView.setUint8(cursor, entry.type);
  cursor += Uint8Array.BYTES_PER_ELEMENT;

  switch (entry.type) {
    case ENTRY_TYPE.NUMBER:
      dataView.setFloat64(cursor, entry.value);
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      dataView.setUint16(cursor, entry.allocatedBytes);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      dataView.setUint16(cursor, entry.allocatedBytes);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      // const arr = new Uint8Array(entry.allocatedBytes);
      // const writtenBytes1 = stringEncodeInto(arr, 0, entry.value);
      // eslint-disable-next-line no-case-declarations
      const writtenBytes = stringEncodeInto(uint8, cursor, entry.value);

      if (writtenBytes !== entry.allocatedBytes) {
        // eslint-disable-next-line no-undef
        console.warn({
          value: entry.value,
          writtenBytes,
          allocatedBytes: entry.allocatedBytes
        });
        throw new Error("WTF???");
      }

      cursor += entry.allocatedBytes;

      break;

    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      if (entry.value > MAX_64_BIG_INT || entry.value < -MAX_64_BIG_INT) {
        throw new BigInt64OverflowError();
      }

      dataView.setBigUint64(
        cursor,
        entry.type === ENTRY_TYPE.BIGINT_NEGATIVE ? -entry.value : entry.value
      );
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.SET:
    case ENTRY_TYPE.MAP:
      dataView.setUint8(cursor, entry.refsCount);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      dataView.setUint32(cursor, entry.value);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      dataView.setUint8(cursor, entry.refsCount);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      dataView.setUint32(cursor, entry.value);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      dataView.setUint32(cursor, entry.length);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      dataView.setUint32(cursor, entry.allocatedLength);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.DATE:
      dataView.setUint8(cursor, entry.refsCount);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      dataView.setFloat64(cursor, entry.value);
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }
}

export function appendEntry(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
  entry: Entry
) {
  const size = sizeOfEntry(entry);

  const memoryAddress = carrier.allocator.calloc(size);

  writeEntry(carrier, memoryAddress, entry);

  return memoryAddress;
}

export function readEntry(
  carrier: DataViewAndAllocatorCarrier,
  startingCursor: number
): Entry {
  let cursor = startingCursor;

  const entryType: ENTRY_TYPE = carrier.dataView.getUint8(cursor);
  cursor += Uint8Array.BYTES_PER_ELEMENT;

  const entry: any = {
    type: entryType,
    value: undefined as any
  };

  // let writtenDataSizeInBytes = 0;

  switch (entryType) {
    case ENTRY_TYPE.UNDEFINED:
      break;

    case ENTRY_TYPE.NULL:
      break;

    case ENTRY_TYPE.BOOLEAN:
      entry.value = carrier.dataView.getUint8(cursor) !== 0;
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.NUMBER:
      entry.value = carrier.dataView.getFloat64(cursor);
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      // eslint-disable-next-line no-case-declarations
      const stringLength = carrier.dataView.getUint16(cursor);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      entry.allocatedBytes = carrier.dataView.getUint16(cursor);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      // decode fails with zero length array
      if (stringLength > 0) {
        // this wrapping is needed until:
        // https://github.com/whatwg/encoding/issues/172
        // eslint-disable-next-line no-case-declarations
        // const tempAB = new ArrayBuffer(stringLength);
        // arrayBufferCopyTo(dataView.buffer, cursor, stringLength, tempAB, 0);

        entry.value = stringDecode(carrier.uint8, cursor, stringLength);
      } else {
        entry.value = "";
      }

      cursor += stringLength;

      break;

    case ENTRY_TYPE.BIGINT_POSITIVE:
      entry.value = carrier.dataView.getBigUint64(cursor);
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.BIGINT_NEGATIVE:
      entry.value = -carrier.dataView.getBigUint64(cursor);
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      entry.refsCount = carrier.dataView.getUint8(cursor);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      entry.value = carrier.dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      entry.refsCount = carrier.dataView.getUint8(cursor);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      entry.value = carrier.dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.length = carrier.dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.allocatedLength = carrier.dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.DATE:
      entry.refsCount = carrier.dataView.getUint8(cursor);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      entry.value = carrier.dataView.getFloat64(cursor);
      cursor += Float64Array.BYTES_PER_ELEMENT;
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
  carrier: DataViewAndAllocatorCarrier,
  ptrToPtr: number,
  value: any
) {
  const existingEntryPointer = carrier.dataView.getUint32(ptrToPtr);
  const existingValueEntry = readEntry(carrier, existingEntryPointer);

  // try to re use memory
  if (
    !isKnownAddressValuePointer(existingEntryPointer) &&
    isPrimitive(value) &&
    isPrimitiveEntryType(existingValueEntry.type) &&
    canReuseMemoryOfEntry(existingValueEntry, value)
  ) {
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

    carrier.dataView.setUint32(ptrToPtr, newEntryPointer);

    return {
      referencedPointers,
      existingEntryPointer,
      existingValueEntry
    };
  }
}

export function writeValueInPtrToPtrAndHandleMemory(
  externalArgs: ExternalArgs,
  carrier: DataViewAndAllocatorCarrier,
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
  carrier: DataViewAndAllocatorCarrier,
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
  carrier: DataViewAndAllocatorCarrier,
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
  carrier: DataViewAndAllocatorCarrier,
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

export function getObjectPropPtrToPtr(
  { dataView }: DataViewAndAllocatorCarrier,
  pointerToEntry: number
) {
  const keyStringLength = dataView.getUint16(pointerToEntry + 1);
  const valuePtrToPtr =
    Uint16Array.BYTES_PER_ELEMENT + pointerToEntry + 1 + keyStringLength;
  const nextPtrToPtr = valuePtrToPtr + Uint32Array.BYTES_PER_ELEMENT;

  return {
    valuePtrToPtr,
    nextPtrToPtr
  };
}

export function getObjectValuePtrToPtr(pointerToEntry: number) {
  return pointerToEntry + 1 + 1;
}

export function memComp(
  dataView: DataView,
  aStart: number,
  bStart: number,
  length: number
) {
  if (
    dataView.byteLength < aStart + length ||
    dataView.byteLength < bStart + length
  ) {
    return false;
  }
  for (let i = 0; i <= length - i; i += 1) {
    // compare 8 using Float64Array?
    if (dataView.getUint8(aStart + i) !== dataView.getUint8(bStart + i)) {
      return false;
    }
  }

  return true;
}

export function compareStringOrNumberEntriesInPlace(
  dataView: DataView,
  entryAPointer: number,
  entryBPointer: number
) {
  let cursor = 0;
  const entryAType: ENTRY_TYPE = dataView.getUint8(entryAPointer + cursor);
  const entryBType: ENTRY_TYPE = dataView.getUint8(entryBPointer + cursor);
  cursor += 1;

  if (entryAType !== entryBType) {
    return false;
  }

  if (entryAType === ENTRY_TYPE.STRING) {
    const aLength = dataView.getUint16(entryAPointer + cursor);
    const bLength = dataView.getUint16(entryBPointer + cursor);

    if (aLength !== bLength) {
      return false;
    }

    // string length
    cursor += Uint16Array.BYTES_PER_ELEMENT;
    // allocated length, skip.
    cursor += Uint16Array.BYTES_PER_ELEMENT;

    return memComp(
      dataView,
      entryAPointer + cursor,
      entryBPointer + cursor,
      aLength
    );
  }

  return (
    dataView.getFloat64(entryAPointer + cursor) ===
    dataView.getFloat64(entryBPointer + cursor)
  );
}
