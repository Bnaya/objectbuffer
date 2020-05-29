import { ENTRY_TYPE } from "../entry-types";
import { stringEncodeInto } from "../stringEncodeInto";
import { Heap } from "../../structsGenerator/consts";
import {
  number_value_place,
  string_charsPointer_get,
  typeOnly_type_get,
  number_value_ctor,
  string_bytesLength_get,
} from "../generatedStructs";

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

export function getKeyStart(heap: Heap, keyPointer: number) {
  if (typeOnly_type_get(heap, keyPointer) === ENTRY_TYPE.NUMBER) {
    return keyPointer + number_value_place;
  } else {
    // string
    return string_charsPointer_get(heap, keyPointer);
  }
}

export function getKeyLength(heap: Heap, keyPointer: number) {
  if (typeOnly_type_get(heap, keyPointer) === ENTRY_TYPE.NUMBER) {
    return number_value_ctor.BYTES_PER_ELEMENT;
  } else {
    return string_bytesLength_get(heap, keyPointer);
  }
}
