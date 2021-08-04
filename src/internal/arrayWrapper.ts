import {
  getFinalValueAtArrayIndex,
  setValueAtArrayIndex,
  arraySort,
  extendArrayIfNeeded,
  arrayReverse,
} from "./arrayHelpers";
import { INTERNAL_API_SYMBOL } from "./symbols";
import { arraySplice } from "./arraySplice";
import type { ExternalArgs, GlobalCarrier } from "./interfaces";
import {
  IllegalArrayIndexError,
  UnsupportedOperationError,
} from "./exceptions";
import { BaseProxyTrap } from "./BaseProxyTrap";
import { array_length_get } from "./generatedStructs";

const getOwnPropertyDescriptorLENGTH = {
  configurable: false,
  enumerable: false,
  writable: true,
} as const;

const getOwnPropertyDescriptorHAS = {
  configurable: false,
  enumerable: true,
} as const;

export class ArrayWrapper
  extends BaseProxyTrap
  implements ProxyHandler<Record<string, unknown>>
{
  public get(target: Record<string, unknown>, p: PropertyKey): any {
    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    if (p in this && p !== "constructor") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return this[p];
    }

    if (p === "length") {
      return array_length_get(this.carrier.heap, this.entryPointer);
    }

    if (typeof p === "string" || typeof p === "number") {
      const asInt = typeof p === "string" ? Number.parseInt(p, 10) : p;

      if (Number.isSafeInteger(asInt)) {
        return getFinalValueAtArrayIndex(
          this.externalArgs,
          this.carrier,
          this.entryPointer,
          asInt
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return target[p];
  }

  public deleteProperty(
    target: Record<string, unknown>,
    p: PropertyKey
  ): boolean {
    const index = typeof p === "number" ? p : Number.parseInt(p as string, 10);

    return this.splice(index, 1).length === 1;
  }

  public enumerate(): PropertyKey[] {
    throw new Error("unsupported enumerate");
  }

  public ownKeys() {
    const length = array_length_get(this.carrier.heap, this.entryPointer);

    return [...new Array(length).keys(), "length"].map((i) =>
      typeof i === "number" ? i.toString() : i
    );
  }

  public getOwnPropertyDescriptor(target: Record<string, unknown>, prop: any) {
    if (prop === "length") {
      return getOwnPropertyDescriptorLENGTH;
    }

    if (!this.has(target, prop)) {
      return undefined;
    }

    return getOwnPropertyDescriptorHAS;
  }

  public has(target: Record<string, unknown>, p: PropertyKey): boolean {
    if (p === INTERNAL_API_SYMBOL) {
      return true;
    }

    const length = array_length_get(this.carrier.heap, this.entryPointer);

    if (typeof p === "number") {
      return length - 1 >= p;
    } else if (typeof p === "string") {
      return length - 1 >= Number.parseInt(p, 10);
    }

    throw new Error("unsupported");
  }

  public set(
    target: Record<string, unknown>,
    accessedProp: PropertyKey,
    value: unknown
  ): boolean {
    if (typeof accessedProp === "symbol") {
      throw new IllegalArrayIndexError();
    }

    if (accessedProp === "length") {
      return this.handleLengthChange(value);
    }

    const possibleIndex = Number.parseInt(accessedProp as string, 10);

    if (!Number.isSafeInteger(possibleIndex) || possibleIndex < 0) {
      throw new IllegalArrayIndexError();
    }

    // @todo: avoid closure/function runtime allocation
    this.carrier.allocator.transaction(() => {
      setValueAtArrayIndex(
        this.externalArgs,
        this.carrier,
        this.entryPointer,
        possibleIndex,
        value
      );
    });

    return true;
  }

  public *entries(): Iterable<[number, any]> {
    let index = 0;
    let length = 0;

    do {
      yield [
        index,
        getFinalValueAtArrayIndex(
          this.externalArgs,
          this.carrier,
          this.entryPointer,
          index
        ),
      ];

      index += 1;

      length = array_length_get(this.carrier.heap, this.entryPointer);
    } while (index < length);
  }

  public *keys(): Iterable<number> {
    let index = 0;
    let length = 0;

    do {
      yield index;

      index += 1;

      length = array_length_get(this.carrier.heap, this.entryPointer);
    } while (index < length);
  }

  public *values(): Iterable<any> {
    let index = 0;
    let length = 0;

    do {
      yield getFinalValueAtArrayIndex(
        this.externalArgs,
        this.carrier,
        this.entryPointer,
        index
      );

      index += 1;

      length = array_length_get(this.carrier.heap, this.entryPointer);
    } while (index < length);
  }

  get [Symbol.iterator]() {
    return this.values;
  }

  public sort(comparator?: (a: any, b: any) => 1 | -1 | 0) {
    arraySort(this.externalArgs, this.carrier, this.entryPointer, comparator);
  }

  public splice(start: number, deleteCount?: number, ...items: any[]): any[] {
    // @todo: avoid closure/function runtime allocation
    return this.carrier.allocator.transaction(() => {
      return arraySplice(
        this.externalArgs,
        this.carrier,
        this.entryPointer,
        start,
        deleteCount,
        ...items
      );
    });
  }

  public reverse() {
    arrayReverse(this.carrier, this.entryPointer);
    return this;
  }

  // no copy inside array is needed, so we can live with the built-in impl
  // public push() {
  // }

  // public pop() {}

  public shift() {
    return this.splice(0, 1)[0];
  }

  public unshift(...elements: any) {
    this.splice(0, 0, ...elements);

    return array_length_get(this.carrier.heap, this.entryPointer);
  }

  public isExtensible() {
    return true;
  }

  public preventExtensions(): boolean {
    throw new UnsupportedOperationError();
  }

  public setPrototypeOf(): boolean {
    throw new UnsupportedOperationError();
  }

  public defineProperty(): // target: Record<string, unknown>,
  // p: PropertyKey,
  // attributes: PropertyDescriptor
  boolean {
    throw new UnsupportedOperationError();
    // if (
    //   typeof p === "symbol" ||
    //   attributes.enumerable === false ||
    //   attributes.get ||
    //   attributes.set
    // ) {
    //   throw new IllegalObjectPropConfigError();
    // }

    // return Object.defineProperty(target, p, attributes);
  }

  private handleLengthChange(newLength: unknown): boolean {
    if (
      typeof newLength !== "number" ||
      !Number.isSafeInteger(newLength) ||
      newLength < 0
    ) {
      throw new RangeError("Invalid array length");
    }

    const currentLength = array_length_get(
      this.carrier.heap,
      this.entryPointer
    );

    if (currentLength === newLength) {
      return true;
    }

    // @todo: avoid closure/function runtime allocation
    this.carrier.allocator.transaction(() => {
      if (currentLength > newLength) {
        this.splice(newLength, currentLength - newLength);

        return;
      }

      extendArrayIfNeeded(
        this.externalArgs,
        this.carrier,
        this.entryPointer,
        newLength
      );
    });

    return true;
  }
}

export function createArrayWrapper(
  externalArgs: ExternalArgs,
  globalCarrier: GlobalCarrier,
  entryPointer: number
): Array<any> {
  return new Proxy(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    [],
    new ArrayWrapper(externalArgs, globalCarrier, entryPointer)
  ) as any;
}
