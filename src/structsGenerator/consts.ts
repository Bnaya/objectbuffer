export const typedArrays = {
  Uint8Array,
  Uint8ClampedArray,
  Int8Array,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array,
} as const;

export type TypedArrayNameToType = typeof typedArrays;

export type Heap = {
  [x in keyof TypedArrayNameToType]: InstanceType<TypedArrayNameToType[x]>;
};

export type PossibleTypedArrays = TypedArrayNameToType[keyof TypedArrayNameToType];
export type StructManifest = { [x: string]: PossibleTypedArrays };

export function createHeap(sb: ArrayBuffer | SharedArrayBuffer): Heap {
  const r = Object.fromEntries(
    Object.entries(typedArrays).map(([name, Ctor]) => [name, new Ctor(sb)])
  );

  return r as any;
}
