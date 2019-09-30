import { primitive, Entry } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";

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
      value
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
      type: ENTRY_TYPE.BIGINT,
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
