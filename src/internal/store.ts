import { ENTRY_TYPE, isPrimitiveEntryType } from "./entry-types";
import { Entry, ObjectPropEntry, primitive } from "./interfaces";
import { arrayBufferCopyTo, isPrimitive, primitiveValueToEntry } from "./utils";
import { ExternalArgs } from "./interfaces";

export function initializeArrayBuffer(arrayBuffer: ArrayBuffer) {
  const dataView = new DataView(arrayBuffer);

  // global lock
  dataView.setInt32(0, 0);

  // End of data pointer / first free byte
  dataView.setUint32(8, 24);

  // first entry pointer
  dataView.setUint32(16, 24);

  return dataView;
}

export function writeEntry(
  externalArgs: ExternalArgs,
  dataView: DataView,
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
    case ENTRY_TYPE.UNDEFINED:
      break;

    case ENTRY_TYPE.NULL:
      break;

    case ENTRY_TYPE.BOOLEAN:
      dataView.setUint8(cursor, entry.value ? 1 : 0);
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.NUMBER:
      dataView.setFloat64(cursor, entry.value);
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      // eslint-disable-next-line no-case-declarations
      const encodedString: Uint8Array = externalArgs.textEncoder.encode(
        entry.value
      );
      dataView.setUint16(cursor, encodedString.byteLength);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      dataView.setUint16(cursor, entry.allocatedBytes);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      for (let i = 0; i < encodedString.length; i++) {
        dataView.setUint8(cursor, encodedString[i]);
        cursor += Uint8Array.BYTES_PER_ELEMENT;
      }

      cursor += entry.allocatedBytes;

      break;

    case ENTRY_TYPE.BIGINT:
      dataView.setBigInt64(cursor, entry.value);
      cursor += BigInt64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.UBIGINT:
      dataView.setBigUint64(cursor, entry.value);
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
      dataView.setUint32(cursor, entry.value);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT_PROP:
      // eslint-disable-next-line no-case-declarations
      const encodedStringKey: Uint8Array = externalArgs.textEncoder.encode(
        entry.value.key
      );
      dataView.setUint16(cursor, encodedStringKey.byteLength);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      for (let i = 0; i < encodedStringKey.length; i++) {
        dataView.setUint8(cursor, encodedStringKey[i]);
        cursor += Uint8Array.BYTES_PER_ELEMENT;
      }

      dataView.setUint32(cursor, entry.value.value);
      cursor += Uint32Array.BYTES_PER_ELEMENT;

      dataView.setUint32(cursor, entry.value.next);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.ARRAY:
      dataView.setUint32(cursor, entry.value);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      dataView.setUint32(cursor, entry.length);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      dataView.setUint32(cursor, entry.allocatedLength);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }

  return cursor - startingCursor;
}

export function appendEntry(
  externalArgs: ExternalArgs,
  dataView: DataView,
  entry: Entry
) {
  // End of data pointer
  const firstFreeByte = dataView.getUint32(8);

  const written = writeEntry(externalArgs, dataView, firstFreeByte, entry);
  dataView.setUint32(8, firstFreeByte + written);

  return {
    start: firstFreeByte,
    length: written
  };
}

export function readEntry(
  externalArgs: ExternalArgs,
  dataView: DataView,
  startingCursor: number
): [Entry, number] {
  let cursor = startingCursor;

  const entryType: ENTRY_TYPE = dataView.getUint8(cursor);
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
      entry.value = dataView.getUint8(cursor) !== 0;
      cursor += Uint8Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.NUMBER:
      entry.value = dataView.getFloat64(cursor);
      cursor += Float64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.STRING:
      // eslint-disable-next-line no-case-declarations
      const stringLength = dataView.getUint16(cursor);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      entry.allocatedBytes = dataView.getUint16(cursor);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      // this wrapping is needed until:
      // https://github.com/whatwg/encoding/issues/172
      // eslint-disable-next-line no-case-declarations
      const tempAB = new ArrayBuffer(stringLength);
      arrayBufferCopyTo(dataView.buffer, cursor, stringLength, tempAB, 0);

      entry.value = externalArgs.textDecoder.decode(tempAB);

      cursor += stringLength;

      break;

    case ENTRY_TYPE.BIGINT:
      entry.value = dataView.getBigInt64(cursor);
      cursor += BigInt64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.UBIGINT:
      entry.value = dataView.getBigUint64(cursor);
      cursor += BigUint64Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT:
      entry.value = dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    case ENTRY_TYPE.OBJECT_PROP:
      // eslint-disable-next-line no-case-declarations
      const keyStringLength = dataView.getUint16(cursor);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      // this wrapping is needed until:
      // https://github.com/whatwg/encoding/issues/172
      // eslint-disable-next-line no-case-declarations
      const tempAB2 = new ArrayBuffer(keyStringLength);
      arrayBufferCopyTo(dataView.buffer, cursor, keyStringLength, tempAB2, 0);

      // eslint-disable-next-line no-case-declarations
      const objectPropsValue: ObjectPropEntry["value"] = {
        key: externalArgs.textDecoder.decode(tempAB2),
        value: dataView.getUint32(cursor + keyStringLength),
        next: dataView.getUint32(
          cursor + keyStringLength + Uint32Array.BYTES_PER_ELEMENT
        )
      };

      cursor +=
        keyStringLength +
        Uint32Array.BYTES_PER_ELEMENT +
        Uint32Array.BYTES_PER_ELEMENT;

      entry.value = objectPropsValue;
      break;

    case ENTRY_TYPE.ARRAY:
      entry.value = dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.length = dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      entry.allocatedLength = dataView.getUint32(cursor);
      cursor += Uint32Array.BYTES_PER_ELEMENT;
      break;

    default:
      throw new Error(ENTRY_TYPE[entryType] + " Not implemented yet");
  }

  return [entry, cursor - startingCursor];
}

export function reserveMemory(dataView: DataView, length: number) {
  const firstFreeByte = dataView.getUint32(8);

  dataView.setUint32(8, firstFreeByte + length);

  return firstFreeByte;
}

export function canSaveValueIntoEntry(
  externalArgs: ExternalArgs,
  entryA: Entry,
  value: primitive
) {
  const typeofTheValue = typeof value;

  if (entryA.type === ENTRY_TYPE.BOOLEAN && typeofTheValue === "boolean") {
    return true;
  }

  // number & bigint 64 are the same size
  if (
    (entryA.type === ENTRY_TYPE.BIGINT ||
      entryA.type === ENTRY_TYPE.UBIGINT ||
      entryA.type === ENTRY_TYPE.NUMBER) &&
    (typeofTheValue === "bigint" || typeofTheValue === "number")
  ) {
    return true;
  }

  if (
    entryA.type === ENTRY_TYPE.STRING &&
    typeofTheValue === "string" &&
    entryA.allocatedBytes >= externalArgs.textEncoder.encode(value).length
  ) {
    return true;
  }

  if (
    ((entryA.type === ENTRY_TYPE.NULL ||
      entryA.type === ENTRY_TYPE.UNDEFINED) &&
      value === undefined) ||
    value === null
  ) {
    return true;
  }

  return false;
}

export function overwriteEntryIfPossible(
  externalArgs: ExternalArgs,
  dataView: DataView,
  pointerToExistingEntry: number,
  value: any
) {
  if (isPrimitive(value)) {
    const existingValueEntry = readEntry(
      externalArgs,
      dataView,
      pointerToExistingEntry
    );

    if (canSaveValueIntoEntry(externalArgs, existingValueEntry[0], value)) {
      const stringAllocatedBytes =
        existingValueEntry[0].type === ENTRY_TYPE.STRING
          ? existingValueEntry[0].allocatedBytes
          : 0;

      const newEntry = primitiveValueToEntry(
        externalArgs,
        value,
        stringAllocatedBytes
      );

      writeEntry(externalArgs, dataView, pointerToExistingEntry, newEntry);
      return true;
    }

    return false;
  }

  return false;
}
