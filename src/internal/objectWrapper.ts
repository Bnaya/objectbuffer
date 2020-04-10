import { ObjectEntry, ExternalArgs, GlobalCarrier } from "./interfaces";
import {
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey,
  objectGet,
  objectSet,
} from "./objectWrapperHelpers";

import { INTERNAL_API_SYMBOL } from "./symbols";
import {
  IllegalObjectPropConfigError,
  UnsupportedOperationError,
} from "./exceptions";
import { allocationsTransaction } from "./allocationsTransaction";
import { BaseProxyTrap } from "./BaseProxyTrap";
import { hashMapNodeLookup } from "./hashmap/hashmap";

export class ObjectWrapper extends BaseProxyTrap<ObjectEntry>
  implements ProxyHandler<{}> {
  public get(target: {}, p: PropertyKey): any {
    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    if (typeof p === "symbol") {
      return undefined;
    }

    return objectGet(this.externalArgs, this.carrier, this.entry.value, p);
  }

  public deleteProperty(target: {}, p: PropertyKey): boolean {
    if (typeof p === "symbol") {
      return false;
    }

    return deleteObjectPropertyEntryByKey(
      this.externalArgs,
      this.carrier,
      this.entry.value,
      p
    );
  }

  public enumerate(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.carrier,
      this.entry.value
    );

    return gotEntries.map((e) => e.key);
  }

  public ownKeys(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.carrier,
      this.entry.value
    );

    return gotEntries.map((e) => e.key);
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
      return false;
    }

    return hashMapNodeLookup(this.carrier, this.entry.value, p) !== 0;
  }

  public set(target: {}, p: PropertyKey, value: any): boolean {
    if (typeof p === "symbol") {
      throw new IllegalObjectPropConfigError();
    }

    allocationsTransaction(() => {
      objectSet(this.externalArgs, this.carrier, this.entry.value, p, value);
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

export function createObjectWrapper<T = any>(
  externalArgs: ExternalArgs,
  globalCarrier: GlobalCarrier,
  entryPointer: number
): T {
  return new Proxy(
    { objectBufferWrapper: "objectBufferWrapper" },
    new ObjectWrapper(externalArgs, globalCarrier, entryPointer)
  ) as any;
}
