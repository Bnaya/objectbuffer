import { ObjectEntry } from "./interfaces";
import { readEntry, writeEntry, appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import {
  findObjectPropertyEntry,
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey,
  findLastObjectPropertyEntry
} from "./objectWrapperHelpers";
import { saveValue } from "./saveValue";

import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";

export const GET_UNDERLYING_ARRAY_BUFFER_SYMBOL = Symbol(
  "GET_UNDERLYING_ARRAY_BUFFER_SYMBOL"
);

export class ObjectWrapper implements ProxyHandler<{}> {
  constructor(
    private dataView: DataView,
    private entryPointer: number,
    private textDecoder: any,
    private textEncoder: any,
    private isTopLevel: boolean,
    private arrayAdditionalAllocation: number
  ) {}

  public getUnderlyingArrayBuffer() {
    if (!this.isTopLevel) {
      throw new Error("Only Supported on Top Level");
    }

    return this.dataView.buffer;
  }

  public get(target: {}, p: PropertyKey): any {
    if (p === GET_UNDERLYING_ARRAY_BUFFER_SYMBOL) {
      return this.getUnderlyingArrayBuffer();
    }

    /// empty object
    if (this.entry.value === 0) {
      return undefined;
    }

    const foundEntry = findObjectPropertyEntry(
      this.dataView,
      this.entryPointer,
      // Add validation ?
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      p,
      this.textDecoder
    );

    if (foundEntry === undefined) {
      return undefined;
    }

    const [valueEntry] = readEntry(
      this.dataView,
      foundEntry[1].value.value,
      this.textDecoder
    );

    return entryToFinalJavaScriptValue(
      this.dataView,
      this.textDecoder,
      this.textEncoder,
      this.arrayAdditionalAllocation,
      valueEntry,
      foundEntry[1].value.value
    );
  }

  public deleteProperty(target: {}, p: PropertyKey): boolean {
    return deleteObjectPropertyEntryByKey(
      this.dataView,
      this.textDecoder,
      this.textEncoder,
      this.entryPointer,
      p as any
    );
  }

  public enumerate(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.dataView,
      this.entryPointer,
      this.textDecoder
    );

    return gotEntries.map(e => e.value.key);
  }

  public ownKeys(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.dataView,
      this.entryPointer,
      this.textDecoder
    );

    return gotEntries.map(e => e.value.key);
  }

  public getOwnPropertyDescriptor() {
    return { configurable: true, enumerable: true };
  }

  public has(target: {}, p: PropertyKey) {
    /// empty object
    if (this.entry.value === 0) {
      return false;
    }

    const foundEntry = findObjectPropertyEntry(
      this.dataView,
      this.entry.value,
      // Add validation ?
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      p,
      this.textDecoder
    );

    return foundEntry !== undefined;
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    const { start: newValueEntryPointer } = saveValue(
      this.textEncoder,
      this.dataView,
      this.arrayAdditionalAllocation,
      value
    );

    const foundPropEntry = findObjectPropertyEntry(
      this.dataView,
      this.entryPointer,
      p as string,
      this.textDecoder
    );

    // new prop
    if (foundPropEntry === undefined) {
      const { start: newPropEntryPointer } = appendEntry(
        this.dataView,
        {
          type: ENTRY_TYPE.OBJECT_PROP,
          value: {
            next: 0,
            value: newValueEntryPointer,
            key: p as string
          }
        },
        this.textEncoder
      );

      const [lastItemPointer, lastItemEntry] = findLastObjectPropertyEntry(
        this.dataView,
        this.entryPointer,
        this.textDecoder
      );

      if (lastItemEntry.type === ENTRY_TYPE.OBJECT) {
        writeEntry(
          this.dataView,
          lastItemPointer,
          {
            type: ENTRY_TYPE.OBJECT,
            value: newPropEntryPointer
          },
          this.textEncoder
        );
      } else {
        writeEntry(
          this.dataView,
          lastItemPointer,
          {
            type: ENTRY_TYPE.OBJECT_PROP,
            value: {
              next: newPropEntryPointer,
              value: lastItemEntry.value.value,
              key: lastItemEntry.value.key
            }
          },
          this.textEncoder
        );
      }
    } else {
      // overwrite value
      writeEntry(
        this.dataView,
        foundPropEntry[0],
        {
          type: ENTRY_TYPE.OBJECT_PROP,
          value: {
            key: foundPropEntry[1].value.key,
            next: foundPropEntry[1].value.next,
            value: newValueEntryPointer
          }
        },
        this.textEncoder
      );
    }

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

  // getPrototypeOf? (target: T): object | null;
  // setPrototypeOf? (target: T, v: any): boolean;
  // isExtensible? (target: T): boolean;
  // preventExtensions? (target: T): boolean;
  // getOwnPropertyDescriptor? (target: T, p: PropertyKey): PropertyDescriptor | undefined;
  // has? (target: T, p: PropertyKey): boolean;
  // get? (target: T, p: PropertyKey, receiver: any): any;
  // set? (target: T, p: PropertyKey, value: any, receiver: any): boolean;
  // deleteProperty? (target: T, p: PropertyKey): boolean;
  // defineProperty? (target: T, p: PropertyKey, attributes: PropertyDescriptor): boolean;
  // enumerate? (target: T): PropertyKey[];
  // ownKeys? (target: T): PropertyKey[];
  // apply? (target: T, thisArg: any, argArray?: any): any;
  // construct? (target: T, argArray: any, newTarget?: any): object;

  private get entry(): ObjectEntry {
    return readEntry(
      this.dataView,
      this.entryPointer,
      this.textDecoder
    )[0] as ObjectEntry;
  }
}

export function createObjectWrapper<T = any>(
  dataView: DataView,
  entryPointer: number,
  textDecoder: any,
  textEncoder: any,
  isTopLevel = false,
  arrayAdditionalAllocation = 50
): T {
  return new Proxy(
    { bla: 1 },
    new ObjectWrapper(
      dataView,
      entryPointer,
      textDecoder,
      textEncoder,
      isTopLevel,
      arrayAdditionalAllocation
    )
  ) as any;
}
