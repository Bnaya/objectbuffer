import { ExternalArgs, GlobalCarrier, InternalAPI } from "./interfaces";
import {
  deleteObjectPropertyEntryByKey,
  objectGet,
  objectSet,
  mapOrSetClear,
} from "./objectWrapperHelpers";

import { INTERNAL_API_SYMBOL } from "./symbols";

import { allocationsTransaction } from "./allocationsTransaction";
import { BaseProxyTrap } from "./BaseProxyTrap";
import {
  hashMapNodeLookup,
  hashMapSize,
  hashMapNodePointerToKeyValue,
  hashmapNodesPointerIterator,
} from "./hashmap/hashmap";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { object_pointerToHashMap_get } from "./generatedStructs";

export class MapWrapper<K extends string | number, V> extends BaseProxyTrap
  implements Map<K, V> {
  clear(): void {
    mapOrSetClear(this.externalArgs, this.carrier, this.entryPointer);
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
    return hashMapSize(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    );
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  *entries(): IterableIterator<[K, V]> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    )) {
      const { valuePointer, keyPointer } = hashMapNodePointerToKeyValue(
        this.carrier.heap,
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
          this.carrier.heap.Uint32Array[
            valuePointer / Uint32Array.BYTES_PER_ELEMENT
          ]
        ),
      ];
    }
  }

  *keys(): IterableIterator<K> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    )) {
      const t = hashMapNodePointerToKeyValue(this.carrier.heap, nodePointer);

      yield entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        t.keyPointer
      );
    }
  }

  *values(): IterableIterator<V> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    )) {
      const { valuePointer } = hashMapNodePointerToKeyValue(
        this.carrier.heap,
        nodePointer
      );

      yield entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        this.carrier.heap.Uint32Array[
          valuePointer / Uint32Array.BYTES_PER_ELEMENT
        ]
      );
    }
  }

  get [Symbol.toStringTag]() {
    return Map.prototype[Symbol.toStringTag];
  }

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

    return objectGet(
      this.externalArgs,
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
      p
    );
  }

  public delete(p: string | number): boolean {
    if (!(typeof p === "string" || typeof p === "number")) {
      return false;
    }

    return deleteObjectPropertyEntryByKey(
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
      p
    );
  }

  public has(p: string | number) {
    if (!(typeof p === "string" || typeof p === "number")) {
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

  public set(p: string | number, value: any) {
    if (!(typeof p === "string" || typeof p === "number")) {
      return this;
    }

    allocationsTransaction(() => {
      objectSet(
        this.externalArgs,
        this.carrier,
        object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
        p,
        value
      );
    }, this.carrier.allocator);

    return this;
  }
}

export function createMapWrapper<K extends string | number, V>(
  externalArgs: ExternalArgs,
  globalCarrier: GlobalCarrier,
  entryPointer: number
): Map<K, V> {
  return new MapWrapper<K, V>(externalArgs, globalCarrier, entryPointer);
}
