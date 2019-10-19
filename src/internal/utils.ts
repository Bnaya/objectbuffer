import { primitive, Entry, ExternalArgs, InternalAPI } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { INTERNAL_API_SYMBOL } from "./symbols";
import { FIRST_FREE_BYTE_POINTER_TO_POINTER } from "./consts";

const primitives = [
  "string",
  "number",
  "bigint",
  "boolean",
  "undefined"
] as const;

export function isPrimitive(value: unknown): value is primitive {
  if (primitives.includes(typeof value as any)) {
    return true;
  }

  if (value === null) {
    return true;
  }

  return false;
}

export function primitiveValueToEntry(
  externalArgs: ExternalArgs,
  value: primitive,
  stringAllocatedBytes: number
): Entry {
  if (typeof value === "string") {
    return {
      type: ENTRY_TYPE.STRING,
      value,
      allocatedBytes: Math.max(
        externalArgs.textEncoder.encode(value).length,
        stringAllocatedBytes
      )
    };
  }

  if (typeof value === "number") {
    return {
      type: ENTRY_TYPE.NUMBER,
      value
    };
  }

  if (typeof value === "bigint") {
    return {
      type:
        value >= BigInt("0")
          ? ENTRY_TYPE.BIGINT_POSITIVE
          : ENTRY_TYPE.BIGINT_NEGATIVE,
      value
    };
  }

  if (typeof value === "boolean") {
    return {
      type: ENTRY_TYPE.BOOLEAN,
      value
    };
  }

  if (typeof value === "undefined") {
    return {
      type: ENTRY_TYPE.UNDEFINED
    };
  }

  if (value === null) {
    return {
      type: ENTRY_TYPE.NULL
    };
  }

  throw new Error("unexpected");
}

export function createKnownTypeGuard<T>(arr: ReadonlyArray<T>) {
  return function knownTypeGuard(v: unknown): v is T {
    return arr.includes(v as any);
  };
}

export function invariant(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

export function arrayBufferCopyTo(
  origin: ArrayBuffer,
  startByte: number,
  length: number,
  target: ArrayBuffer,
  toTargetByte: number
) {
  const copyFrom = new Uint8Array(origin);
  const copyTo = new Uint8Array(target);

  for (let i = 0; i < length; i += 1) {
    copyTo[toTargetByte + i] = copyFrom[startByte + i];
  }
}

export function getFirstFreeByte(
  arrayBufferOrDataView: DataView | ArrayBuffer
) {
  return (arrayBufferOrDataView instanceof DataView
    ? arrayBufferOrDataView
    : new DataView(arrayBufferOrDataView)
  ).getUint32(FIRST_FREE_BYTE_POINTER_TO_POINTER);
}

export function getOurPointerIfApplicable(value: any, ourDateView: DataView) {
  const api: InternalAPI | undefined = value[INTERNAL_API_SYMBOL];
  if (api && api.getDataView() === ourDateView) {
    return api.getEntryPointer();
  }
}
