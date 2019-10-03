import {
  getFinalValueAtArrayIndex,
  arrayGetMetadata,
  setValueAtArrayIndex,
  arraySort
} from "./arrayHelpers";
import { GET_UNDERLYING_POINTER_SYMBOL } from "./symbols";
import { arraySplice } from "./arraySplice";

export class ArrayWrapper implements ProxyHandler<{}> {
  constructor(
    private dataView: DataView,
    private arrayAdditionalAllocation: number,
    private entryPointer: number,
    private textDecoder: any,
    private textEncoder: any
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
        this.dataView,
        this.textDecoder,
        this.entryPointer
      ).length;
    }

    if (typeof p === "string" || typeof p === "number") {
      const asInt = typeof p === "string" ? Number.parseInt(p, 10) : p;

      if (Number.isSafeInteger(asInt)) {
        return getFinalValueAtArrayIndex(
          this.dataView,
          this.textDecoder,
          this.textEncoder,
          this.arrayAdditionalAllocation,
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
    throw new Error("unsupported");
  }

  public enumerate(): PropertyKey[] {
    throw new Error("unsupported");
  }

  public ownKeys(): PropertyKey[] {
    const length = arrayGetMetadata(
      this.dataView,
      this.textDecoder,
      this.entryPointer
    ).length;

    return [...new Array(length).keys()];
  }

  public getOwnPropertyDescriptor() {
    return { configurable: true, enumerable: true };
  }

  public has(target: {}, p: PropertyKey): boolean {
    throw new Error("unsupported");
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    setValueAtArrayIndex(
      this.dataView,
      this.textDecoder,
      this.textEncoder,
      this.arrayAdditionalAllocation,
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
          this.dataView,
          this.textDecoder,
          this.textEncoder,
          this.arrayAdditionalAllocation,
          this.entryPointer,
          index
        )
      ];

      index += 1;

      length = arrayGetMetadata(
        this.dataView,
        this.textDecoder,
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
        this.dataView,
        this.textDecoder,
        this.entryPointer
      ).length;
    } while (index < length);
  }

  public *values(): Iterable<any> {
    let index = 0;
    let length = 0;

    do {
      yield getFinalValueAtArrayIndex(
        this.dataView,
        this.textDecoder,
        this.textEncoder,
        this.arrayAdditionalAllocation,
        this.entryPointer,
        index
      );

      index += 1;

      length = arrayGetMetadata(
        this.dataView,
        this.textDecoder,
        this.entryPointer
      ).length;
    } while (index < length);
  }

  get [Symbol.iterator]() {
    return this.values;
  }

  // in-place methods
  private shift() {
    throw new Error("unsupported");
  }
  private unshift() {
    throw new Error("unsupported");
  }
  private pop() {
    throw new Error("unsupported");
  }
  private push() {
    throw new Error("unsupported");
  }

  public sort(comparator?: (a: any, b: any) => 1 | -1 | 0) {
    arraySort(
      this.dataView,
      this.textDecoder,
      this.textEncoder,
      this.arrayAdditionalAllocation,
      this.entryPointer,
      comparator
    );
  }

  public splice(start: number, deleteCount?: number, ...items: any[]) {
    return arraySplice(
      this.dataView,
      this.textDecoder,
      this.textEncoder,
      this.arrayAdditionalAllocation,
      this.entryPointer,
      start,
      deleteCount,
      ...items
    );
  }

  // // copy methods
  // private concat() {
  //   throw new Error("unsupported");
  // }
  // private slice() {
  //   throw new Error("unsupported");
  // }
  // private map() {
  //   throw new Error("unsupported");
  // }
  // private reduce() {
  //   throw new Error("unsupported");
  // }
}

export function createArrayWrapper(
  dataView: DataView,
  arrayAdditionalAllocation: number,
  entryPointer: number,
  textDecoder: any,
  textEncoder: any
): Array<any> {
  return new Proxy(
    [],
    new ArrayWrapper(
      dataView,
      arrayAdditionalAllocation,
      entryPointer,
      textDecoder,
      textEncoder
    )
  ) as any;
}
