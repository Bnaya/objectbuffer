import {
  ExternalArgs,
  DataViewAndAllocatorCarrier,
  MapEntry,
  InternalAPI
} from "./interfaces";
import {
  deleteObjectPropertyEntryByKey,
  objectSet,
  mapOrSetClear
} from "./objectWrapperHelpers";

import { INTERNAL_API_SYMBOL } from "./symbols";

import { allocationsTransaction } from "./allocationsTransaction";
import { BaseProxyTrap } from "./BaseProxyTrap";
import {
  hashMapNodeLookup,
  hashMapSize,
  hashMapNodePointerToKeyValue,
  hashmapNodesPointerIterator
} from "./hashmap/hashmap";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";

export class SetWrapper<K extends string | number>
  extends BaseProxyTrap<MapEntry>
  implements Set<K> {
  clear(): void {
    mapOrSetClear(this.externalArgs, this.carrier, this.entryPointer);
  }

  forEach(
    callbackfn: (key: K, key2: K, map: Set<K>) => void,
    thisArg?: any
  ): void {
    for (const pair of this.entries()) {
      callbackfn.call(thisArg || null, pair[1], pair[0], this);
    }
  }

  get size(): number {
    return hashMapSize(this.carrier.dataView, this.entry.value);
  }

  [Symbol.iterator](): IterableIterator<K> {
    return this.keys();
  }

  *entries(): IterableIterator<[K, K]> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.dataView,
      this.entry.value
    )) {
      const t = hashMapNodePointerToKeyValue(
        this.carrier.dataView,
        nodePointer
      );

      const key = entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        t.keyPointer
      );

      yield [key, key];
    }
  }

  *keys(): IterableIterator<K> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.dataView,
      this.entry.value
    )) {
      const t = hashMapNodePointerToKeyValue(
        this.carrier.dataView,
        nodePointer
      );

      yield entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        t.keyPointer
      );
    }
  }
  *values(): IterableIterator<K> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.dataView,
      this.entry.value
    )) {
      const t = hashMapNodePointerToKeyValue(
        this.carrier.dataView,
        nodePointer
      );

      yield entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        t.keyPointer
      );
    }
  }

  get [Symbol.toStringTag]() {
    return Set.prototype[Symbol.toStringTag];
  }

  get [INTERNAL_API_SYMBOL](): InternalAPI {
    return this;
  }

  static get [Symbol.species]() {
    return Set;
  }

  public has(p: string | number) {
    if (!(typeof p === "string" || typeof p === "number")) {
      return false;
    }

    return hashMapNodeLookup(this.carrier, this.entry.value, p) !== 0;
  }

  public add(p: string | number) {
    if (!(typeof p === "string" || typeof p === "number")) {
      return this;
    }

    allocationsTransaction(() => {
      objectSet(
        this.externalArgs,
        this.carrier,
        this.entry.value,
        p,
        undefined
      );
    }, this.carrier.allocator);

    return this;
  }

  public delete(p: string | number): boolean {
    if (!(typeof p === "string" || typeof p === "number")) {
      return false;
    }

    return deleteObjectPropertyEntryByKey(
      this.externalArgs,
      this.carrier,
      this.entry.value,
      p
    );
  }
}

export function createSetWrapper<K extends string | number>(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewAndAllocatorCarrier,
  entryPointer: number
): Set<K> {
  return new SetWrapper<K>(externalArgs, dataViewCarrier, entryPointer);
}
