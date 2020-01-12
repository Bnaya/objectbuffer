import { ENTRY_TYPE } from "./entry-types";
import { TextDecoder, TextEncoder } from "./textEncoderDecoderTypes";

export type primitive = string | number | bigint | boolean | undefined | null;

export type Entry =
  | StringEntry
  | NumberEntry
  | BigIntPositiveEntry
  | BigIntNegativeEntry
  | ObjectEntry
  | ArrayEntry
  | DateEntry
  | MapEntry
  | SetEntry;

export interface StringEntry {
  type: ENTRY_TYPE.STRING;
  value: string;
  allocatedBytes: number;
}

export interface NumberEntry {
  type: ENTRY_TYPE.NUMBER;
  value: number;
}

export interface BigIntPositiveEntry {
  type: ENTRY_TYPE.BIGINT_POSITIVE;
  value: bigint;
}

export interface BigIntNegativeEntry {
  type: ENTRY_TYPE.BIGINT_NEGATIVE;
  value: bigint;
}

export interface ObjectEntry {
  type: ENTRY_TYPE.OBJECT;
  refsCount: number;
  /**
   * Pointer to hashmap
   */
  value: number;
}

export interface ArrayEntry {
  type: ENTRY_TYPE.ARRAY;
  refsCount: number;

  // pointer to the first array item
  value: number;
  length: number;
  allocatedLength: number;
}

export interface DateEntry {
  type: ENTRY_TYPE.DATE;
  refsCount: number;
  value: number;
}

export interface MapEntry {
  type: ENTRY_TYPE.MAP;
  refsCount: number;
  /**
   * Pointer to hashmap
   */
  value: number;
}

export interface SetEntry {
  type: ENTRY_TYPE.SET;
  refsCount: number;
  /**
   * Pointer to hashmap
   */
  value: number;
}

/**
 * The carrier object allows us to swap the DataView easily
 */
export interface GlobalCarrier {
  dataView: DataView;
  uint8: Uint8Array;
  uint16: Uint16Array;
  uint32: Uint32Array;
  float64: Float64Array;
  bigUint64: BigUint64Array;
  allocator: import("@thi.ng/malloc").IMemPool;
}

export type ExternalArgs = Readonly<{
  hashMapLoadFactor: number;
  hashMapMinInitialCapacity: number;
  arrayAdditionalAllocation: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

export type ExternalArgsApi = Readonly<{
  hashMapLoadFactor?: number;
  hashMapMinInitialCapacity?: number;
  arrayAdditionalAllocation?: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

export interface InternalAPI {
  getExternalArgs(): ExternalArgs;
  getCarrier(): Readonly<GlobalCarrier>;
  replaceCarrierContent(carrier: GlobalCarrier): void;
  getEntryPointer(): number;
  destroy(): number;
}
