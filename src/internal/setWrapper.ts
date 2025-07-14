import type { ExternalArgs, GlobalCarrier } from "./interfaces";
import {
  deleteObjectPropertyEntryByKey,
  objectSet,
  mapOrSetClear,
} from "./objectWrapperHelpers";


import { BaseProxyTrap } from "./BaseProxyTrap";
import {
  hashMapNodeLookup,
  hashMapSize,
  hashmapNodesPointerIterator,
  hashMapNodePointerToKey,
} from "./hashmap/hashmap";
import { entryToFinalJavaScriptValue } from "./entryToFinalJavaScriptValue";
import { object_pointerToHashMap_get } from "./generatedStructs";

export class SetWrapper<K extends string | number>
  extends BaseProxyTrap
  implements Set<K>
{
  union<U>(_other: ReadonlySetLike<U>): Set<K | U> {
    throw new Error("Method not implemented.");
  }
  intersection<U>(_other: ReadonlySetLike<U>): Set<K & U> {
    throw new Error("Method not implemented.");
  }
  difference<U>(_other: ReadonlySetLike<U>): Set<K> {
    throw new Error("Method not implemented.");
  }
  symmetricDifference<U>(_other: ReadonlySetLike<U>): Set<K | U> {
    throw new Error("Method not implemented.");
  }
  isSubsetOf(_other: ReadonlySetLike<unknown>): boolean {
    throw new Error("Method not implemented.");
  }
  isSupersetOf(_other: ReadonlySetLike<unknown>): boolean {
    throw new Error("Method not implemented.");
  }
  isDisjointFrom(_other: ReadonlySetLike<unknown>): boolean {
    throw new Error("Method not implemented.");
  }


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
    return hashMapSize(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    );
  }

  [Symbol.iterator](): SetIterator<K> {
    return this.keys();
  }

  *entries(): SetIterator<[K, K]> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    )) {
      const t = hashMapNodePointerToKey(this.carrier.heap, nodePointer);

      const key = entryToFinalJavaScriptValue(
        this.externalArgs,
        this.carrier,
        t
      );

      yield [key, key];
    }
  }

  *keys(): SetIterator<K> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    )) {
      const t = hashMapNodePointerToKey(this.carrier.heap, nodePointer);

      yield entryToFinalJavaScriptValue(this.externalArgs, this.carrier, t);
    }
  }
  *values(): SetIterator<K> {
    for (const nodePointer of hashmapNodesPointerIterator(
      this.carrier.heap,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer)
    )) {
      const t = hashMapNodePointerToKey(this.carrier.heap, nodePointer);

      yield entryToFinalJavaScriptValue(this.externalArgs, this.carrier, t);
    }
  }

  get [Symbol.toStringTag](): string {
    return Set.prototype[Symbol.toStringTag];
  }

  static get [Symbol.species](): SetConstructor {
    return Set;
  }

  public has(p: string | number): boolean {
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

  public add(p: string | number): this {
    if (!(typeof p === "string" || typeof p === "number")) {
      return this;
    }

    objectSet(
      this.externalArgs,
      this.carrier,
      object_pointerToHashMap_get(this.carrier.heap, this.entryPointer),
      p,
      undefined
    );

    return this;
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
}

export function createSetWrapper<K extends string | number>(
  externalArgs: ExternalArgs,
  globalCarrier: GlobalCarrier,
  entryPointer: number
): Set<K> {
  return new SetWrapper<K>(externalArgs, globalCarrier, entryPointer);
}
