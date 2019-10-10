import { ENTRY_TYPE } from "./entry-types";

export type primitive = string | number | bigint | boolean | undefined | null;

export type Entry =
  | NullEntry
  | NullUndefined
  | BooleanEntry
  | StringEntry
  | NumberEntry
  | BigIntEntry
  | UBigIntEntry
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

export interface BigIntEntry {
  type: ENTRY_TYPE.BIGINT;
  value: bigint;
}

export interface UBigIntEntry {
  type: ENTRY_TYPE.UBIGINT;
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
  textDecoder: any;
  textEncoder: any;
}>;
