import { createKnownTypeGuard } from "./utils";

export enum ENTRY_TYPE {
  /**
   * @deprecated
   */
  UNDEFINED,
  /**
   * @deprecated
   */
  NULL,
  NUMBER,
  BIGINT_POSITIVE,
  BIGINT_NEGATIVE,
  STRING,
  /**
   * @deprecated
   */
  BOOLEAN,
  OBJECT,
  /**
   * @deprecated
   */
  OBJECT_PROP,
  ARRAY,
  ARRAY_ITEM,
  MAP,
  SET,
  DATE
}

export const PRIMITIVE_TYPES = [
  ENTRY_TYPE.NUMBER,
  ENTRY_TYPE.BIGINT_POSITIVE,
  ENTRY_TYPE.BIGINT_NEGATIVE,
  ENTRY_TYPE.STRING
] as const;

export const isPrimitiveEntryType = createKnownTypeGuard(PRIMITIVE_TYPES);
