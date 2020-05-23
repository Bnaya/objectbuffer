import { Heap } from "../structsGenerator/consts";
import { stringDecode } from "./stringDecode";
import {
  string_bytesLength_get,
  string_charsPointer_get,
} from "./generatedStructs";

export function readString(heap: Heap, stringEntryPointer: number) {
  return stringDecode(
    heap.Uint8Array,
    string_charsPointer_get(heap, stringEntryPointer),
    string_bytesLength_get(heap, stringEntryPointer)
  );
}
