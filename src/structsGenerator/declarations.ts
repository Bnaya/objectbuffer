import { createStructDeclaration } from "./finenamenotmatter";

export const numberStructDeceleration: {
  type: Float64ArrayConstructor;
  value: Float64ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  value: Float64Array,
});

export const dateStructDeclaration: {
  type: Float64ArrayConstructor;
  refsCount: Uint32ArrayConstructor;
  __padding__: Uint32ArrayConstructor;
  timestamp: Float64ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  __padding__: Uint32Array,
  timestamp: Float64Array,
});

export const arrayStructDeclaration: {
  type: Float64ArrayConstructor;
  refsCount: Uint32ArrayConstructor;
  dataspacePointer: Uint32ArrayConstructor;
  length: Uint32ArrayConstructor;
  allocatedLength: Uint32ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  dataspacePointer: Uint32Array,
  length: Uint32Array,
  allocatedLength: Uint32Array,
});

export const objectMapSetStructDeclaration: {
  type: Float64ArrayConstructor;
  refsCount: Uint32ArrayConstructor;
  pointerToHashMap: Uint32ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  pointerToHashMap: Uint32Array,
});

export const bigIntPositiveOrNegativeStructDeclaration: {
  type: Float64ArrayConstructor;
  value: BigUint64ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  value: BigUint64Array,
});

export const stringStructDeclaration: {
  type: Float64ArrayConstructor;
  refsCount: Uint32ArrayConstructor;
  bytesLength: Uint32ArrayConstructor;
  charsPointer: Uint32ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  bytesLength: Uint32Array,
  charsPointer: Uint32Array,
});

export const typeReaderDeclaration: {
  type: Float64ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
});

export const typeAndRcDeclaration: {
  type: Float64ArrayConstructor;
  refsCount: Uint32ArrayConstructor;
} = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
});

export const linkedListItemDeclaration: {
  NEXT_POINTER: Uint32ArrayConstructor;
  VALUE: Uint32ArrayConstructor;
} = createStructDeclaration({
  NEXT_POINTER: Uint32Array,
  VALUE: Uint32Array,
});

export const linkedListDeclaration: {
  END_POINTER: Uint32ArrayConstructor;
  START_POINTER: Uint32ArrayConstructor;
} = createStructDeclaration({
  END_POINTER: Uint32Array,
  START_POINTER: Uint32Array,
});

export const hashmapDeclaration: {
  ARRAY_POINTER: Uint32ArrayConstructor;
  LINKED_LIST_POINTER: Uint32ArrayConstructor;
  // maybe put save this value in the linked list?
  LINKED_LIST_SIZE: Uint32ArrayConstructor;
  CAPACITY: Uint8ArrayConstructor;
  USED_CAPACITY: Uint8ArrayConstructor;
} = createStructDeclaration({
  ARRAY_POINTER: Uint32Array,
  LINKED_LIST_POINTER: Uint32Array,
  // maybe put save this value in the linked list?
  LINKED_LIST_SIZE: Uint32Array,
  CAPACITY: Uint8Array,
  USED_CAPACITY: Uint8Array,
});

export const hashmapNodeDeclaration: {
  VALUE_POINTER: Uint32ArrayConstructor;
  NEXT_NODE_POINTER: Uint32ArrayConstructor;
  KEY_POINTER: Uint32ArrayConstructor;
  LINKED_LIST_ITEM_POINTER: Uint32ArrayConstructor;
} = createStructDeclaration({
  VALUE_POINTER: Uint32Array,
  NEXT_NODE_POINTER: Uint32Array,
  KEY_POINTER: Uint32Array,
  LINKED_LIST_ITEM_POINTER: Uint32Array,
});
