import {
  getFinalValueAtArrayIndex,
  arrayGetMetadata,
  setValueAtArrayIndex,
  arraySort,
  extendArrayIfNeeded,
  arrayReverse
} from "./arrayHelpers";
import { INTERNAL_API_SYMBOL } from "./symbols";
import { arraySplice } from "./arraySplice";
import { ExternalArgs, DataViewCarrier } from "./interfaces";
import {
  IllegalArrayIndexError,
  UnsupportedOperationError
} from "./exceptions";
import { handleOOM } from "./handleOOM";

export class ArrayWrapper implements ProxyHandler<{}> {
  constructor(
    private externalArgs: ExternalArgs,
    private dataViewCarrier: DataViewCarrier,
    private entryPointer: number
  ) {}

  public get(target: {}, p: PropertyKey): any {
    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    if (p in this && p !== "constructor") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return this[p];
    }

    if (p === "length") {
      return arrayGetMetadata(
        this.externalArgs,
        this.dataViewCarrier.dataView,
        this.entryPointer
      ).length;
    }

    if (typeof p === "string" || typeof p === "number") {
      const asInt = typeof p === "string" ? Number.parseInt(p, 10) : p;

      if (Number.isSafeInteger(asInt)) {
        return getFinalValueAtArrayIndex(
          this.externalArgs,
          this.dataViewCarrier.dataView,
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
      this.dataViewCarrier.dataView,
      this.entryPointer
    ).length;

    return [...new Array(length).keys(), "length"];
  }

  public getOwnPropertyDescriptor(target: {}, prop: any) {
    if (prop === "length") {
      return { configurable: false, enumerable: false };
    }

    if (!this.has(target, prop)) {
      return undefined;
    }

    return { configurable: false, enumerable: true };
  }

  public has(target: {}, p: PropertyKey): boolean {
    const length = arrayGetMetadata(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    ).length;

    if (typeof p === "number") {
      return length - 1 >= p;
    } else if (typeof p === "string") {
      return length - 1 >= Number.parseInt(p, 10);
    }

    throw new Error("unsupported");
  }

  public set(target: {}, accessedProp: PropertyKey, value: any): boolean {
    if (typeof accessedProp === "symbol") {
      throw new IllegalArrayIndexError();
    }

    if (accessedProp === "length") {
      if (!Number.isSafeInteger(value) || value < 0) {
        throw new RangeError("Invalid array length");
      }

      const currentLength = arrayGetMetadata(
        this.externalArgs,
        this.dataViewCarrier.dataView,
        this.entryPointer
      ).length;

      if (currentLength === value) {
        return true;
      }

      handleOOM(() => {
        if (currentLength > value) {
          this.splice(value, currentLength - value);

          return true;
        }

        extendArrayIfNeeded(
          this.externalArgs,
          this.dataViewCarrier.dataView,
          this.entryPointer,
          value
        );
      }, this.dataViewCarrier.dataView);

      return true;
    }

    const possibleIndex = Number.parseInt(accessedProp as string, 10);

    if (!Number.isSafeInteger(possibleIndex) || possibleIndex < 0) {
      throw new IllegalArrayIndexError();
    }

    handleOOM(() => {
      extendArrayIfNeeded(
        this.externalArgs,
        this.dataViewCarrier.dataView,
        this.entryPointer,
        possibleIndex + 1
      );

      setValueAtArrayIndex(
        this.externalArgs,
        this.dataViewCarrier.dataView,
        this.entryPointer,
        possibleIndex,
        value
      );
    }, this.dataViewCarrier.dataView);

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
          this.dataViewCarrier.dataView,
          this.entryPointer,
          index
        )
      ];

      index += 1;

      length = arrayGetMetadata(
        this.externalArgs,
        this.dataViewCarrier.dataView,
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
        this.dataViewCarrier.dataView,
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
        this.dataViewCarrier.dataView,
        this.entryPointer,
        index
      );

      index += 1;

      length = arrayGetMetadata(
        this.externalArgs,
        this.dataViewCarrier.dataView,
        this.entryPointer
      ).length;
    } while (index < length);
  }

  get [Symbol.iterator]() {
    return this.values;
  }

  public sort(comparator?: (a: any, b: any) => 1 | -1 | 0) {
    arraySort(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer,
      comparator
    );
  }

  public splice(start: number, deleteCount?: number, ...items: any[]) {
    return arraySplice(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer,
      start,
      deleteCount,
      ...items
    );
  }

  public reverse() {
    arrayReverse(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    );
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

    return arrayGetMetadata(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    ).length;
  }

  public getDataView() {
    return this.dataViewCarrier.dataView;
  }

  public getEntryPointer() {
    return this.entryPointer;
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

  public defineProperty(): // target: {},
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
}

export function createArrayWrapper(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewCarrier,
  entryPointer: number
): Array<any> {
  return new Proxy(
    [],
    new ArrayWrapper(externalArgs, dataViewCarrier, entryPointer)
  ) as any;
}
