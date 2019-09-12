import { ENTRY_TYPE } from "./entry-types";
import { Entry, ObjectPropEntry } from "./interfaces";
const DEFAULT_ARRAY_BUFFER_SIZE = 10 ^ 6;

export class Store {
  private arrayBuffer: ArrayBuffer;
  private dataView: DataView;

  constructor(arrayBuffer?: ArrayBuffer) {
    this.arrayBuffer = arrayBuffer
      ? arrayBuffer
      : new ArrayBuffer(DEFAULT_ARRAY_BUFFER_SIZE);

    this.dataView = new DataView(this.arrayBuffer);
  }
}

export function initializeArrayBuffer(arrayBuffer: ArrayBuffer) {
  const dataView = new DataView(arrayBuffer);

  // End of data pointer
  dataView.setUint32(0, 16);

  // first entry pointer
  dataView.setUint32(8, 16);

  return dataView;
}

export function writeEntry(
  dataView: DataView,
  startingCursor: number,
  entry: Entry,
  /**
   * pass yours env's textEncoder. (node and the browser has it)
   */
  textEncoder: any
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
      const encodedString: Uint8Array = textEncoder.encode(entry.value);
      dataView.setUint16(cursor, encodedString.byteLength);
      cursor += Uint16Array.BYTES_PER_ELEMENT;

      for (let i = 0; i < encodedString.length; i++) {
        dataView.setUint8(cursor, encodedString[i]);
        cursor += Uint8Array.BYTES_PER_ELEMENT;
      }
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
      const encodedStringKey: Uint8Array = textEncoder.encode(entry.value.key);
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

    default:
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }

  return cursor - startingCursor;
}

export function appendEntry(
  dataView: DataView,
  entry: Entry,
  /**
   * pass yours env's textEncoder. (node and the browser has it)
   */
  textEncoder: any
) {
  // End of data pointer
  const firstFreeByte = dataView.getUint32(0);

  const written = writeEntry(dataView, firstFreeByte, entry, textEncoder);
  dataView.setUint32(0, firstFreeByte + written);

  return {
    start: firstFreeByte,
    length: written
  };
}

export function readEntry(
  dataView: DataView,
  startingCursor: number,
  /**
   * pass yours env's textDecoder. (node and the browser has it)
   */
  textDecoder: any
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
      entry.value = dataView.getUint8(cursor);
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

      entry.value = textDecoder.decode(
        // this wrapping is needed until:
        // https://github.com/whatwg/encoding/issues/172
        new Uint8Array(dataView.buffer.slice(cursor, cursor + stringLength))
      );

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

      // eslint-disable-next-line no-case-declarations
      const objectPropsValue: ObjectPropEntry["value"] = {
        key: textDecoder.decode(
          // this wrapping is needed until:
          // https://github.com/whatwg/encoding/issues/172
          new Uint8Array(
            dataView.buffer.slice(cursor, cursor + keyStringLength)
          )
        ),
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

    default:
      throw new Error(ENTRY_TYPE[entryType] + " Not implemented yet");
  }

  return [entry, cursor - startingCursor];
}
