import { ENTRY_TYPE } from "./entry-types";
import { TextDecoder, TextEncoder } from "./textEncoderDecoderTypes";
import { IMemPool } from "@bnaya/malloc-temporary-fork";

export type primitive = string | number | bigint | boolean | undefined | null;

export type Entry =
  | NullEntry
  | NullUndefined
  | BooleanEntry
  | StringEntry
  | NumberEntry
  | BigIntPositiveEntry
  | BigIntNegativeEntry
  | ObjectEntry
  | ObjectPropEntry
  | ArrayEntry
  | DateEntry;

export interface NullEntry {
  type: ENTRY_TYPE.NULL;
}

export interface NullUndefined {
  type: ENTRY_TYPE.UNDEFINED;
}

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
   * Pointer to first prop
   * */
  value: number;
}

export interface ObjectPropEntry {
  type: ENTRY_TYPE.OBJECT_PROP;
  /**
   * Location of next element
   */
  value: {
    key: string;
    /**
     * Pointer to value entry
     */
    value: number;
    /**
     * Pointer to next prop
     */
    next: number;
  };
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

/**
 * The carrier object allows us to swap the DataView easily
 */
export interface DataViewAndAllocatorCarrier {
  dataView: DataView;
  allocator: import("@bnaya/malloc-temporary-fork").IMemPool;
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
