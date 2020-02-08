import { ENTRY_TYPE } from "../entry-types";
import { stringEncodeInto } from "../stringEncodeInto";
import { GlobalCarrier } from "../interfaces";

export function hashCodeInPlace(
  uint8: Uint8Array,
  capacity: number,
  keyStart: number,
  keyBytesLength: number
): number {
  let h = 0 | 0;

  // const hashed: number[] = [];

  for (let i = 0; i < keyBytesLength; i++) {
    h = (Math.imul(31, h) + uint8[i + keyStart]) | 0;
  }

  // console.log(hashed);

  return Math.abs(h % capacity);
}

export function hashCodeExternalValue(
  capacity: number,
  value: string | number
): number {
  const ab = new ArrayBuffer(typeof value === "string" ? value.length * 3 : 8);
  const uint8 = new Uint8Array(ab);
  let keyBytesLength = ab.byteLength;

  if (typeof value === "string") {
    keyBytesLength = stringEncodeInto(new Uint8Array(ab), 0, value);
  } else {
    new Float64Array(ab)[0] = value;
  }

  return hashCodeInPlace(uint8, capacity, 0, keyBytesLength);
}

export function hashCodeEntry(
  carrier: GlobalCarrier,
  capacity: number,
  pointer: number
): number {
  const type: ENTRY_TYPE.NUMBER | ENTRY_TYPE.STRING = carrier.uint8[pointer];

  if (type === ENTRY_TYPE.NUMBER) {
    return hashCodeInPlace(carrier.uint8, capacity, pointer + 1, 8);
  } else {
    return hashCodeInPlace(
      carrier.uint8,
      capacity,
      pointer + 1 + Uint16Array.BYTES_PER_ELEMENT,
      carrier.uint16[(pointer + 1) / Uint16Array.BYTES_PER_ELEMENT]
    );
  }
}

export function getKeyStartLength(carrier: GlobalCarrier, keyPointer: number) {
  if (
    carrier.uint32[keyPointer / Uint32Array.BYTES_PER_ELEMENT] ===
    ENTRY_TYPE.NUMBER
  ) {
    return {
      start: keyPointer + 1,
      length: Float64Array.BYTES_PER_ELEMENT
    };
  } else {
    return {
      start: keyPointer + 1 + 2 + 2,
      length: carrier.uint16[(keyPointer + 1) / Uint16Array.BYTES_PER_ELEMENT]
    };
  }
}
