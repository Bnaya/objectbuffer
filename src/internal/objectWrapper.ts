import {
  ObjectEntry,
  ExternalArgs,
  DataViewAndAllocatorCarrier
} from "./interfaces";
import {
  findObjectPropertyEntry,
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey,
  objectGet,
  objectSet
} from "./objectWrapperHelpers";

import { INTERNAL_API_SYMBOL } from "./symbols";
import {
  IllegalObjectPropConfigError,
  UnsupportedOperationError
} from "./exceptions";
import { allocationsTransaction } from "./allocationsTransaction";
import { BaseProxyTrap } from "./BaseProxyTrap";

export class ObjectWrapper extends BaseProxyTrap<ObjectEntry>
  implements ProxyHandler<{}> {
  public get(target: {}, p: PropertyKey): any {
    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    /// empty object
    if (this.entry.value === 0) {
      return undefined;
    }

    return objectGet(
      this.externalArgs,
      this.carrier,
      this.entryPointer,
      p as string
    );
  }

  public deleteProperty(target: {}, p: PropertyKey): boolean {
    return deleteObjectPropertyEntryByKey(
      this.externalArgs,
      this.carrier,
      this.entryPointer,
      p as string
    );
  }

  public enumerate(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.externalArgs,
      this.carrier.dataView,
      this.entryPointer
    );

    return gotEntries.map(e => e.value.key);
  }

  public ownKeys(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.externalArgs,
      this.carrier.dataView,
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
    if (p === INTERNAL_API_SYMBOL) {
      return true;
    }

    if (typeof p === "symbol") {
      throw new IllegalObjectPropConfigError();
    }

    /// empty object
    if (this.entry.value === 0) {
      return false;
    }

    const foundEntry = findObjectPropertyEntry(
      this.externalArgs,
      this.carrier.dataView,
      this.entryPointer,
      p as string
    );

    return foundEntry !== undefined;
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    if (typeof p === "symbol") {
      throw new IllegalObjectPropConfigError();
    }

    allocationsTransaction(() => {
      objectSet(
        this.externalArgs,
        this.carrier,
        this.entryPointer,
        p as string,
        value
      );
    }, this.carrier.allocator);

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
}

export function createObjectWrapper<T = any>(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewAndAllocatorCarrier,
  entryPointer: number
): T {
  return new Proxy(
    { objectBufferWrapper: "objectBufferWrapper" },
    new ObjectWrapper(externalArgs, dataViewCarrier, entryPointer)
  ) as any;
}
