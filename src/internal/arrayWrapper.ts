import {
  getFinalValueAtArrayIndex,
  arrayGetMetadata,
  setValueAtArrayIndex,
  arraySort,
  extendArrayIfNeeded,
  arrayReverse
} from "./arrayHelpers";
import { GET_UNDERLYING_POINTER_SYMBOL } from "./symbols";
import { arraySplice } from "./arraySplice";
import { ExternalArgs } from "./interfaces";

export class ArrayWrapper implements ProxyHandler<{}> {
  constructor(
    private externalArgs: ExternalArgs,
    private dataView: DataView,
    private entryPointer: number
  ) {}

  public get(target: {}, p: PropertyKey): any {
    if (p === GET_UNDERLYING_POINTER_SYMBOL) {
      return this.entryPointer;
    }

    if (p in this && p !== "constructor") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return this[p];
    }

    if (p === "length") {
      return arrayGetMetadata(
        this.externalArgs,
        this.dataView,
        this.entryPointer
      ).length;
    }

    if (typeof p === "string" || typeof p === "number") {
      const asInt = typeof p === "string" ? Number.parseInt(p, 10) : p;

      if (Number.isSafeInteger(asInt)) {
        return getFinalValueAtArrayIndex(
          this.externalArgs,
          this.dataView,
          this.entryPointer,
          asInt
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return target[p];
  }

  public deleteProperty(target: {}, p: PropertyKey): boolean {
    const index = typeof p === "number" ? p : Number.parseInt(p as string, 10);

    return this.splice(index, 1).length === 1;
  }

  public enumerate(): PropertyKey[] {
    throw new Error("unsupported enumerate");
  }

  public ownKeys(): PropertyKey[] {
    const length = arrayGetMetadata(
      this.externalArgs,
      this.dataView,
      this.entryPointer
    ).length;

    return [...new Array(length).keys(), "length"];
  }

  public getOwnPropertyDescriptor(target: {}, prop: any) {
    if (prop === "length") {
      return { configurable: false, enumerable: false };
    }

    return { configurable: false, enumerable: true };
  }

  public has(target: {}, p: PropertyKey): boolean {
    const length = arrayGetMetadata(
      this.externalArgs,
      this.dataView,
      this.entryPointer
    ).length;

    if (typeof p === "number") {
      return length - 1 >= p;
    } else if (typeof p === "string") {
      return length - 1 >= Number.parseInt(p, 10);
    }

    throw new Error("unsupported");
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    if (p === "length") {
      if (!Number.isSafeInteger(value) || value < 0) {
        throw new RangeError("Invalid array length");
      }

      const currentLength = arrayGetMetadata(
        this.externalArgs,
        this.dataView,
        this.entryPointer
      ).length;

      if (currentLength === value) {
        return true;
      }

      if (currentLength > value) {
        this.splice(value, currentLength - value);

        return true;
      }

      extendArrayIfNeeded(
        this.externalArgs,
        this.dataView,
        this.entryPointer,
        value
      );

      return true;
    }

    extendArrayIfNeeded(
      this.externalArgs,
      this.dataView,
      this.entryPointer,
      Number.parseInt(p as string, 10) + 1
    );

    setValueAtArrayIndex(
      this.externalArgs,
      this.dataView,
      this.entryPointer,
      Number.parseInt(p as string, 10),
      value
    );

    return true;
  }

  public isExtensible() {
    return true;
  }

  public preventExtensions(): boolean {
    throw new Error("unsupported");
  }

  public setPrototypeOf(): boolean {
    throw new Error("unsupported");
  }

  public *entries(): Iterable<[number, any]> {
    let index = 0;
    let length = 0;

    do {
      yield [
        index,
        getFinalValueAtArrayIndex(
          this.externalArgs,
          this.dataView,
          this.entryPointer,
          index
        )
      ];

      index += 1;

      length = arrayGetMetadata(
        this.externalArgs,
        this.dataView,
        this.entryPointer
      ).length;
    } while (index < length);
  }

  public *keys(): Iterable<number> {
    let index = 0;
    let length = 0;

    do {
      yield index;

      index += 1;

      length = arrayGetMetadata(
        this.externalArgs,
        this.dataView,
        this.entryPointer
      ).length;
    } while (index < length);
  }

  public *values(): Iterable<any> {
    let index = 0;
    let length = 0;

    do {
      yield getFinalValueAtArrayIndex(
        this.externalArgs,
        this.dataView,
        this.entryPointer,
        index
      );

      index += 1;

      length = arrayGetMetadata(
        this.externalArgs,
        this.dataView,
        this.entryPointer
      ).length;
    } while (index < length);
  }

  get [Symbol.iterator]() {
    return this.values;
  }

  public sort(comparator?: (a: any, b: any) => 1 | -1 | 0) {
    arraySort(this.externalArgs, this.dataView, this.entryPointer, comparator);
  }

  public splice(start: number, deleteCount?: number, ...items: any[]) {
    return arraySplice(
      this.externalArgs,
      this.dataView,
      this.entryPointer,
      start,
      deleteCount,
      ...items
    );
  }

  public reverse() {
    arrayReverse(this.externalArgs, this.dataView, this.entryPointer);
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

    return arrayGetMetadata(this.externalArgs, this.dataView, this.entryPointer)
      .length;
  }
}

export function createArrayWrapper(
  externalArgs: ExternalArgs,
  dataView: DataView,
  entryPointer: number
): Array<any> {
  return new Proxy(
    [],
    new ArrayWrapper(externalArgs, dataView, entryPointer)
  ) as any;
}
