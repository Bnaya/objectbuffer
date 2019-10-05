import { ObjectEntry, ExternalArgs } from "./interfaces";
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
import {
  GET_UNDERLYING_ARRAY_BUFFER_SYMBOL,
  GET_UNDERLYING_POINTER_SYMBOL
} from "./symbols";

export class ObjectWrapper implements ProxyHandler<{}> {
  constructor(
    private externalArgs: ExternalArgs,
    private dataView: DataView,
    private entryPointer: number,
    private isTopLevel: boolean
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

    if (p === GET_UNDERLYING_POINTER_SYMBOL) {
      return this.entryPointer;
    }

    /// empty object
    if (this.entry.value === 0) {
      return undefined;
    }

    const foundEntry = findObjectPropertyEntry(
      this.externalArgs,
      this.dataView,
      this.entryPointer,
      // Add validation ?
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      p
    );

    if (foundEntry === undefined) {
      return undefined;
    }

    const [valueEntry] = readEntry(
      this.externalArgs,
      this.dataView,
      foundEntry[1].value.value
    );

    return entryToFinalJavaScriptValue(
      this.externalArgs,
      this.dataView,
      valueEntry,
      foundEntry[1].value.value
    );
  }

  public deleteProperty(target: {}, p: PropertyKey): boolean {
    return deleteObjectPropertyEntryByKey(
      this.externalArgs,
      this.dataView,
      this.entryPointer,
      p as any
    );
  }

  public enumerate(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.externalArgs,
      this.dataView,
      this.entryPointer
    );

    return gotEntries.map(e => e.value.key);
  }

  public ownKeys(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.externalArgs,
      this.dataView,
      this.entryPointer
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
      this.externalArgs,
      this.dataView,
      this.entry.value,
      // Add validation ?
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      p
    );

    return foundEntry !== undefined;
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    const { start: newValueEntryPointer } = saveValue(
      this.externalArgs,
      this.dataView,
      value
    );

    const foundPropEntry = findObjectPropertyEntry(
      this.externalArgs,
      this.dataView,
      this.entryPointer,
      p as string
    );

    // new prop
    if (foundPropEntry === undefined) {
      const { start: newPropEntryPointer } = appendEntry(
        this.externalArgs,
        this.dataView,
        {
          type: ENTRY_TYPE.OBJECT_PROP,
          value: {
            next: 0,
            value: newValueEntryPointer,
            key: p as string
          }
        }
      );

      const [lastItemPointer, lastItemEntry] = findLastObjectPropertyEntry(
        this.externalArgs,
        this.dataView,
        this.entryPointer
      );

      if (lastItemEntry.type === ENTRY_TYPE.OBJECT) {
        writeEntry(this.externalArgs, this.dataView, lastItemPointer, {
          type: ENTRY_TYPE.OBJECT,
          value: newPropEntryPointer
        });
      } else {
        writeEntry(this.externalArgs, this.dataView, lastItemPointer, {
          type: ENTRY_TYPE.OBJECT_PROP,
          value: {
            next: newPropEntryPointer,
            value: lastItemEntry.value.value,
            key: lastItemEntry.value.key
          }
        });
      }
    } else {
      // overwrite value
      writeEntry(this.externalArgs, this.dataView, foundPropEntry[0], {
        type: ENTRY_TYPE.OBJECT_PROP,
        value: {
          key: foundPropEntry[1].value.key,
          next: foundPropEntry[1].value.next,
          value: newValueEntryPointer
        }
      });
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
      this.externalArgs,
      this.dataView,
      this.entryPointer
    )[0] as ObjectEntry;
  }
}

export function createObjectWrapper<T = any>(
  externalArgs: ExternalArgs,
  dataView: DataView,
  entryPointer: number,
  isTopLevel = false
): T {
  return new Proxy(
    { objectBufferWrapper: "objectBufferWrapper" },
    new ObjectWrapper(externalArgs, dataView, entryPointer, isTopLevel)
  ) as any;
}
