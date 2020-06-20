import { ENTRY_TYPE } from "../entry-types";
import { Heap } from "../../structsGenerator/consts";
import {
  number_value_place,
  string_charsPointer_get,
  typeOnly_type_get,
  number_value_ctor,
  string_bytesLength_get,
} from "../generatedStructs";

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
