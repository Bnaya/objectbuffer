import {
  primitive,
  Entry,
  ExternalArgs,
  InternalAPI,
  ExternalArgsApi
} from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { INTERNAL_API_SYMBOL } from "./symbols";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS
} from "./consts";

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

export function primitiveValueToEntry(value: primitive): Entry {
  if (typeof value === "string") {
    return {
      type: ENTRY_TYPE.STRING,
      value,
      allocatedBytes: strByteLength(value)
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

  copyTo.set(copyFrom.subarray(startByte, startByte + length), toTargetByte);
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

export function isKnownAddressValuePointer(entryPointer: number) {
  return (
    entryPointer === UNDEFINED_KNOWN_ADDRESS ||
    entryPointer === NULL_KNOWN_ADDRESS ||
    entryPointer === TRUE_KNOWN_ADDRESS ||
    entryPointer === FALSE_KNOWN_ADDRESS
  );
}
