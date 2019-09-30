import { createKnownTypeGuard } from "./utils";

export enum ENTRY_TYPE {
  UNDEFINED,
  NULL,
  NUMBER,
  BIGINT,
  UBIGINT,
  STRING,
  BOOLEAN,
  OBJECT,
  OBJECT_PROP,
  ARRAY,
  ARRAY_ITEM,
  MAP,
  SET,
  DATE
}

export const PRIMITIVE_TYPES = [
  ENTRY_TYPE.NULL,
  ENTRY_TYPE.UNDEFINED,
  ENTRY_TYPE.NUMBER,
  ENTRY_TYPE.BIGINT,
  ENTRY_TYPE.UBIGINT,
  ENTRY_TYPE.BOOLEAN,
  ENTRY_TYPE.STRING
] as const;

export const isPrimitiveEntryType = createKnownTypeGuard(PRIMITIVE_TYPES);
