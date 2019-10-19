import { ObjectEntry, ExternalArgs, DataViewCarrier } from "./interfaces";
import { readEntry } from "./store";
import {
  findObjectPropertyEntry,
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey,
  objectGet,
  objectSet
} from "./objectWrapperHelpers";

import { REPLACE_DATA_VIEW_SYMBOL, INTERNAL_API_SYMBOL } from "./symbols";
import {
  IllegalObjectPropConfigError,
  UnsupportedOperationError
} from "./exceptions";
import { handleOOM } from "./handleOOM";

export class ObjectWrapper implements ProxyHandler<{}> {
  constructor(
    private externalArgs: ExternalArgs,
    private dataViewCarrier: DataViewCarrier,
    private entryPointer: number,
    private isTopLevel: boolean
  ) {}

  private replaceDataView(dataView: DataView) {
    this.dataViewCarrier.dataView = dataView;
  }

  public get(target: {}, p: PropertyKey): any {
    if (p === REPLACE_DATA_VIEW_SYMBOL) {
      return this.replaceDataView.bind(this);
    }

    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    /// empty object
    if (this.entry.value === 0) {
      return undefined;
    }

    return objectGet(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer,
      p as string
    );
  }

  public deleteProperty(target: {}, p: PropertyKey): boolean {
    return deleteObjectPropertyEntryByKey(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer,
      p as string
    );
  }

  public enumerate(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    );

    return gotEntries.map(e => e.value.key);
  }

  public ownKeys(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    );

    return gotEntries.map(e => e.value.key);
  }

  public getOwnPropertyDescriptor(target: {}, p: PropertyKey) {
    if (this.has(target, p)) {
      return { configurable: true, enumerable: true };
    }

    return undefined;
  }

  public has(target: {}, p: PropertyKey) {
    if (typeof p === "symbol") {
      throw new IllegalObjectPropConfigError();
    }

    /// empty object
    if (this.entry.value === 0) {
      return false;
    }

    const foundEntry = findObjectPropertyEntry(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer,
      p as string
    );

    return foundEntry !== undefined;
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    if (typeof p === "symbol") {
      throw new IllegalObjectPropConfigError();
    }

    handleOOM(() => {
      objectSet(
        this.externalArgs,
        this.dataViewCarrier.dataView,
        this.entryPointer,
        p as string,
        value
      );
    }, this.dataViewCarrier.dataView);

    return true;
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

  // getPrototypeOf? (target: T): object | null;
  // setPrototypeOf? (target: T, v: any): boolean;
  // isExtensible? (target: T): boolean;
  // preventExtensions? (target: T): boolean;
  // getOwnPropertyDescriptor? (target: T, p: PropertyKey): PropertyDescriptor | undefined;
  // has? (target: T, p: PropertyKey): boolean;
  // get? (target: T, p: PropertyKey, receiver: any): any;
  // set? (target: T, p: PropertyKey, value: any, receiver: any): boolean;
  // deleteProperty? (target: T, p: PropertyKey): boolean;
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
  // enumerate? (target: T): PropertyKey[];
  // ownKeys? (target: T): PropertyKey[];
  // apply? (target: T, thisArg: any, argArray?: any): any;
  // construct? (target: T, argArray: any, newTarget?: any): object;

  private get entry(): ObjectEntry {
    return readEntry(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    )[0] as ObjectEntry;
  }

  public getDataView() {
    return this.dataViewCarrier.dataView;
  }

  public getEntryPointer() {
    return this.entryPointer;
  }
}

export function createObjectWrapper<T = any>(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewCarrier,
  entryPointer: number,
  isTopLevel = false
): T {
  return new Proxy(
    { objectBufferWrapper: "objectBufferWrapper" },
    new ObjectWrapper(externalArgs, dataViewCarrier, entryPointer, isTopLevel)
  ) as any;
}
