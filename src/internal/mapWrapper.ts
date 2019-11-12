import {
  ExternalArgs,
  DataViewAndAllocatorCarrier,
  MapEntry,
  InternalAPI
} from "./interfaces";
import {
  deleteObjectPropertyEntryByKey,
  objectGet,
  objectSet
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

export class MapWrapper<K extends string | number, V>
  extends BaseProxyTrap<MapEntry>
  implements Map<K, V> {
  clear(): void {
    // @todo impl using helper function with direct list access
    for (const key of [...this.keys()]) {
      this.delete(key);
    }
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
  ): void {
    for (const pair of this.entries()) {
      callbackfn.call(thisArg || null, pair[1], pair[0], this);
    }
  }

  get size(): number {
    return hashMapSize(this.carrier.dataView, this.entry.value);
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  *entries(): IterableIterator<[K, V]> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.dataView,
      this.entry.value
    )) {
      const { valuePointer, keyPointer } = hashMapNodePointerToKeyValue(
        this.carrier.dataView,
        nodePointer
      );

      yield [
        entryToFinalJavaScriptValue(
          this.externalArgs,
          this.carrier,
          keyPointer
        ),
        entryToFinalJavaScriptValue(
          this.externalArgs,
          this.carrier,
          this.carrier.dataView.getUint32(valuePointer)
        )
      ];
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

  *values(): IterableIterator<V> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.dataView,
      this.entry.value
    )) {
      const { valuePointer } = hashMapNodePointerToKeyValue(
        this.carrier.dataView,
        nodePointer
      );

      yield entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        this.carrier.dataView.getUint32(valuePointer)
      );
    }
  }

  [Symbol.toStringTag] = Map.prototype[Symbol.toStringTag];

  get [INTERNAL_API_SYMBOL](): InternalAPI {
    return this;
  }

  static get [Symbol.species]() {
    return Map;
  }

  public get(p: string | number) {
    if (!(typeof p === "string" || typeof p === "number")) {
      return undefined;
    }

    return objectGet(this.externalArgs, this.carrier, this.entry.value, p);
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

  public has(p: string | number) {
    if (!(typeof p === "string" || typeof p === "number")) {
      return false;
    }

    return (
      hashMapNodeLookup(
        this.externalArgs,
        this.carrier.dataView,
        this.entry.value,
        p
      ) !== 0
    );
  }

  public set(p: string | number, value: any) {
    if (!(typeof p === "string" || typeof p === "number")) {
      return this;
    }

    allocationsTransaction(() => {
      objectSet(this.externalArgs, this.carrier, this.entry.value, p, value);
    }, this.carrier.allocator);

    return this;
  }
}

export function createMapWrapper<K extends string | number, V>(
  externalArgs: ExternalArgs,
  dataViewCarrier: DataViewAndAllocatorCarrier,
  entryPointer: number
): Map<K, V> {
  return new MapWrapper<K, V>(externalArgs, dataViewCarrier, entryPointer);
}
