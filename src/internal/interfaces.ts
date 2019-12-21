import { ENTRY_TYPE } from "./entry-types";
import { TextDecoder, TextEncoder } from "./textEncoderDecoderTypes";
import { IMemPool } from "@thi.ng/malloc";

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

export interface NullEntry {
  type: ENTRY_TYPE.NULL;
}

/**
 * @deprecated
 */
export interface NullUndefined {
  type: ENTRY_TYPE.UNDEFINED;
}

/**
 * @deprecated
 */
export interface BooleanEntry {
  type: ENTRY_TYPE.BOOLEAN;
  value: boolean;
}

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
export interface DataViewAndAllocatorCarrier {
  dataView: DataView;
  allocator: import("@thi.ng/malloc").IMemPool;
}

export type ExternalArgs = Readonly<{
  hashMapLoadFactor: number;
  hashMapMinInitialCapacity: number;
  arrayAdditionalAllocation: number;
  minimumStringAllocation: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

export type ExternalArgsApi = Readonly<{
  hashMapLoadFactor?: number;
  hashMapMinInitialCapacity?: number;
  arrayAdditionalAllocation?: number;
  minimumStringAllocation?: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

export interface InternalAPI {
  getExternalArgs(): ExternalArgs;
  getCarrier(): Readonly<DataViewAndAllocatorCarrier>;
  replaceCarrierContent(dataView: DataView, pool: IMemPool): void;
  getEntryPointer(): number;
  destroy(): number;
}
