import { ENTRY_TYPE } from "../entry-types";
import { stringEncodeInto } from "../stringEncodeInto";

export function hashCodeInPlace(
  dataView: DataView,
  capacity: number,
  keyStart: number,
  keyBytesLength: number
): number {
  let h = 0 | 0;

  // const hashed: number[] = [];

  for (let i = 0; i < keyBytesLength; i++) {
    // hashed.push(dataView.getUint8(i + keyStart));
    h = (Math.imul(31, h) + dataView.getUint8(i + keyStart)) | 0;
  }

  // console.log(hashed);

  return Math.abs(h % capacity);
}

export function hashCodeExternalValue(
  capacity: number,
  value: string | number
): number {
  const ab = new ArrayBuffer(typeof value === "string" ? value.length * 3 : 8);
  const dv = new DataView(ab);
  let keyBytesLength = ab.byteLength;

  if (typeof value === "string") {
    keyBytesLength = stringEncodeInto(new Uint8Array(ab), 0, value);
  } else {
    dv.setFloat64(0, value);
  }

  return hashCodeInPlace(dv, capacity, 0, keyBytesLength);
}

export function hashCodeEntry(
  dataView: DataView,
  capacity: number,
  pointer: number
): number {
  const type: ENTRY_TYPE.NUMBER | ENTRY_TYPE.STRING = dataView.getUint8(
    pointer
  );

  if (type === ENTRY_TYPE.NUMBER) {
    return hashCodeInPlace(dataView, capacity, pointer + 1, 8);
  } else {
    return hashCodeInPlace(
      dataView,
      capacity,
      pointer + 1 + Uint16Array.BYTES_PER_ELEMENT,
      dataView.getUint16(pointer + 1)
    );
  }
}

export function getKeyStartLength(dataView: DataView, keyPointer: number) {
  if (dataView.getUint32(keyPointer) === ENTRY_TYPE.NUMBER) {
    return {
      start: keyPointer + 1,
      length: Float64Array.BYTES_PER_ELEMENT
    };
  } else {
    return {
      start: keyPointer + 1 + 2 + 2,
      length: dataView.getUint16(keyPointer + 1)
    };
  }
}
