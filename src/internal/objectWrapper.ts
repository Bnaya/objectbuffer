import { ExternalArgs, GlobalCarrier } from "./interfaces";
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
import { BaseProxyTrap } from "./BaseProxyTrap";
import { hashMapNodeLookup } from "./hashmap/hashmap";
import { object_pointerToHashMap_get } from "./generatedStructs";

export class ObjectWrapper extends BaseProxyTrap
  implements ProxyHandler<Record<string, unknown>> {
  public get(target: Record<string, unknown>, p: PropertyKey): any {
    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    if (typeof p === "symbol") {
      return undefined;
    }

    return objectGet(
      this.externalArgs,
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
      p
    );
  }

  public deleteProperty(
    target: Record<string, unknown>,
    p: PropertyKey
  ): boolean {
    if (typeof p === "symbol") {
      return false;
    }

    return deleteObjectPropertyEntryByKey(
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
      p
    );
  }

  public enumerate(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    );

    return gotEntries.map((e) => e.key);
  }

  public ownKeys(): PropertyKey[] {
    const gotEntries = getObjectPropertiesEntries(
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    );

    return gotEntries.map((e) => e.key);
  }

  public getOwnPropertyDescriptor(
    target: Record<string, unknown>,
    p: PropertyKey
  ) {
    if (this.has(target, p)) {
      return { configurable: true, enumerable: true };
    }

    return undefined;
  }

  public has(target: Record<string, unknown>, p: PropertyKey) {
    if (p === INTERNAL_API_SYMBOL) {
      return true;
    }

    if (typeof p === "symbol") {
      return false;
    }

    return (
      hashMapNodeLookup(
        this.carrier.heap,
        object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
        p
      ) !== 0
    );
  }

  public set(
    target: Record<string, unknown>,
    p: PropertyKey,
    value: any
  ): boolean {
    if (typeof p === "symbol") {
      throw new IllegalObjectPropConfigError();
    }

    objectSet(
      this.externalArgs,
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
      p,
      value
    );

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
