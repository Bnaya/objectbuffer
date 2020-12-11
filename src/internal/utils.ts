import type {
  ExternalArgs,
  InternalAPI,
  ObjectBufferSettings,
} from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { INTERNAL_API_SYMBOL } from "./symbols";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS,
  ENDIANNESS,
} from "./consts";
import { FunctionalAllocatorWrapper } from "./TransactionalAllocator";

export function getEndiannessOfSystem() {
  const F64 = new Float64Array(1);
  const U32 = new Uint32Array(F64.buffer);
  F64[0] = 2;
  if (U32[1] === 0x40000000) {
    return ENDIANNESS.LITTLE;
  } else {
    return ENDIANNESS.BIG;
  }
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

export function getOurPointerIfApplicable(
  value: any,
  ourAllocator: FunctionalAllocatorWrapper
) {
  if (INTERNAL_API_SYMBOL in value) {
    const api = getInternalAPI(value);
    if (api.getCarrier().allocator === ourAllocator) {
      return api.getEntryPointer();
    }
  }
}

export function externalArgsApiToExternalArgsApi(
  p: ObjectBufferSettings
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
  };
}

export function getInternalAPI(value: any): InternalAPI {
  if (!value[INTERNAL_API_SYMBOL]) {
    throw new RangeError("getInternalAPI not applicable");
  }

  return value[INTERNAL_API_SYMBOL];
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

export function isTypeWithRC(type: ENTRY_TYPE) {
  return (
    type === ENTRY_TYPE.OBJECT ||
    type === ENTRY_TYPE.ARRAY ||
    type === ENTRY_TYPE.DATE ||
    type === ENTRY_TYPE.MAP ||
    type === ENTRY_TYPE.SET ||
    type === ENTRY_TYPE.STRING
  );
}

/**
 *
 * I hope It's reliable
 */
export function isSupportedTopLevelValue(value: unknown) {
  return !(
    Array.isArray(value) ||
    value instanceof Date ||
    value instanceof Map ||
    value instanceof Set ||
    typeof value !== "object" ||
    typeof value === null ||
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    value!.constructor.name !== "Object"
  );
}

export function fromEntries(iterable: Iterable<unknown>): unknown {
  // @ts-expect-error we don't care
  return [...iterable].reduce(function (obj: any, [key, val]) {
    obj[key] = val;
    return obj;
  }, {});
}
