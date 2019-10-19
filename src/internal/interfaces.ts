import { ENTRY_TYPE } from "./entry-types";
import { TextDecoder, TextEncoder } from "./textEncoderDecoderTypes";

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
  // pointer to the first array item
  value: number;
  length: number;
  allocatedLength: number;
}

export interface DateEntry {
  type: ENTRY_TYPE.DATE;
  value: number;
}

/**
 * The carrier object allows us to swap the DataView easily
 */
export interface DataViewCarrier {
  dataView: DataView;
}

export type ExternalArgs = Readonly<{
  arrayAdditionalAllocation: number;
  minimumStringAllocation: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

export type ExternalArgsApi = Readonly<{
  arrayAdditionalAllocation?: number;
  minimumStringAllocation?: number;
  textDecoder: TextDecoder;
  textEncoder: TextEncoder;
}>;

export interface InternalAPI {
  getDataView(): DataView;
  getEntryPointer(): number;
}
