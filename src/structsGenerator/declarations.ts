import { createStructDeclaration } from "./finenamenotmatter";

export const numberStructDeceleration = createStructDeclaration({
  type: Float64Array,
  value: Float64Array,
});

export const dateStructDeclaration = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  __padding__: Uint32Array,
  timestamp: Float64Array,
});

export const arrayStructDeclaration = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  dataspacePointer: Uint32Array,
  length: Uint32Array,
  allocatedLength: Uint32Array,
});

export const objectMapSetStructDeclaration = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
  pointerToHashMap: Uint32Array,
});

export const bigIntPositiveOrNegativeStructDeclaration = createStructDeclaration(
  {
    type: Float64Array,
    value: BigUint64Array,
  }
);

export const stringStructDeclaration = createStructDeclaration({
  type: Float64Array,
  bytesLength: Uint32Array,
  charsPointer: Uint32Array,
});

export const typeReaderDeclaration = createStructDeclaration({
  type: Float64Array,
});

export const typeAndRcDeclaration = createStructDeclaration({
  type: Float64Array,
  refsCount: Uint32Array,
});

export const linkedListItemDeclaration = createStructDeclaration({
  NEXT_POINTER: Uint32Array,
  VALUE: Uint32Array,
});
export const linkedListDeclaration = createStructDeclaration({
  END_POINTER: Uint32Array,
  START_POINTER: Uint32Array,
});
