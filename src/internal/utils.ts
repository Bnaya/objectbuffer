import {
  primitive,
  Entry,
  ExternalArgs,
  InternalAPI,
  ExternalArgsApi
} from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { INTERNAL_API_SYMBOL } from "./symbols";

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

export function getOurPointerIfApplicable(value: any, ourDateView: DataView) {
  if (INTERNAL_API_SYMBOL in value) {
    const api = getInternalAPI(value);
    if (api.getCarrier().dataView === ourDateView) {
      return api.getEntryPointer();
    }
  }
}

export function externalArgsApiToExternalArgsApi(
  p: ExternalArgsApi
): ExternalArgs {
  return {
    ...p,
    hashMapMinInitialCapacity: p.hashMapMinInitialCapacity
      ? p.hashMapMinInitialCapacity
      : 8,
    hashMapLoadFactor: p.hashMapLoadFactor ? p.hashMapLoadFactor : 0.75,
    arrayAdditionalAllocation: p.arrayAdditionalAllocation
      ? p.arrayAdditionalAllocation
      : 0,
    minimumStringAllocation: p.minimumStringAllocation
      ? p.minimumStringAllocation
      : 0
  };
}

export function getInternalAPI(value: any): InternalAPI {
  if (!value[INTERNAL_API_SYMBOL]) {
    throw new RangeError("getInternalAPI not applicable");
  }

  return value[INTERNAL_API_SYMBOL];
}

export function strByteLength(str: string) {
  let s = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
  }

  return s;
}

export function align(value: number, alignTo = 8) {
  return Math.ceil(value / alignTo) * alignTo;
}
