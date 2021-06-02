import { fromEntries } from "../internal/utils";

export const typedArraysPropNameToCtorMap = {
  u8: Uint8Array,
  u8c: Uint8ClampedArray,
  i8: Int8Array,
  u16: Uint16Array,
  i16: Int16Array,
  u32: Uint32Array,
  i32: Int32Array,
  f32: Float32Array,
  f64: Float64Array,
  b64: BigInt64Array,
  u64: BigUint64Array,
} as const;

export type TypedArrayPropNameToCtorType = typeof typedArraysPropNameToCtorMap;

const intermediate1 = Object.entries(typedArraysPropNameToCtorMap).map(
  ([key, value]) => {
    return [value.name, key];
  }
);

export const typedArrayNameToHeapProp: any = fromEntries(intermediate1);

export type Heap = {
  [x in keyof TypedArrayPropNameToCtorType]: InstanceType<
    TypedArrayPropNameToCtorType[x]
  >;
};

export type PossibleTypedArrays =
  TypedArrayPropNameToCtorType[keyof TypedArrayPropNameToCtorType];
export type StructManifest = { [x: string]: PossibleTypedArrays };

export function createHeap(sb: ArrayBuffer | SharedArrayBuffer): Heap {
  const r = Object.fromEntries(
    Object.entries(typedArraysPropNameToCtorMap).map(([name, Ctor]) => [
      name,
      new Ctor(sb),
    ])
  );

  return r as any;
}
