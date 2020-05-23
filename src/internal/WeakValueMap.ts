/* eslint-disable @typescript-eslint/ban-ts-comment */
/* istanbul ignore file */

// We can't run test with weakrefs yet

const KEYS = 1;
const VALUES = 2;
const KEYS_VALUES = 3;

declare const FinalizationGroup: any;
declare const FinalizationRegistry: any;
declare const WeakRef: any;

export class WeakValueMap<K, V> implements Map<K, V> {
  private map: Map<K, any>;
  private group: any;

  constructor(
    iterable?: Iterable<[K, V]>,
    protected externalFinalizer?: (key: K) => void
  ) {
    if (iterable !== undefined && iterable !== null) {
      for (const [key, value] of iterable) {
        this.set(key, value);
      }
    }

    this.map = new Map<K, any>();

    const FinalizationSomething =
      typeof FinalizationRegistry !== "undefined"
        ? FinalizationRegistry
        : FinalizationGroup;

    this.group = new FinalizationSomething(
      (iteratorOrKey: Iterable<unknown> | unknown) => {
        // @ts-expect-error
        if (Symbol.iterator in iterable) {
          // @ts-expect-error
          for (const key of iteratorOrKey) {
            this.map.delete(key);
            if (this.externalFinalizer) {
              this.externalFinalizer(key);
            }
          }
        } else {
          // @ts-expect-error
          this.map.delete(iteratorOrKey);
          if (this.externalFinalizer) {
            // @ts-expect-error
            this.externalFinalizer(iteratorOrKey);
          }
        }
      }
    );
  }

  set(key: K, value: V) {
    const existingRef = this.map.get(key);
    if (existingRef) this.group.unregister(existingRef);
    const newRef = new WeakRef(value);
    this.map.set(key, newRef);
    this.group.register(value, key, newRef);

    return this;
  }

  has(key: K) {
    const w = this.map.get(key);
    if (w === undefined) {
      return false;
    }
    if (w.deref() === undefined) {
      this.map.delete(key);
      this.group.unregister(w);
      return false;
    }
    return true;
  }

  get(key: K) {
    const w = this.map.get(key);
    if (w === undefined) {
      return undefined;
    }
    const v = w.deref();
    if (v === undefined) {
      this.map.delete(key);
      this.group.unregister(w);
      return undefined;
    }
    return v;
  }

  delete(key: K) {
    const w = this.map.get(key);
    if (w) {
      this.map.delete(key);
      this.group.unregister(w);
      return w.deref() !== undefined;
    }
    return false;
  }

  clear() {
    for (const w of this.map.values()) {
      this.group.unregister(w);
    }
    this.map.clear();
  }

  *[Symbol.iterator](type?: typeof KEYS | typeof VALUES | typeof KEYS_VALUES) {
    for (const [key, weak] of this.map) {
      const v = weak.deref();
      if (v === undefined) {
        this.map.delete(key);
        this.group.unregister(weak);
      } else if (type === KEYS) {
        yield key;
      } else if (type === VALUES) {
        yield v;
      } else {
        yield [key, v];
      }
    }
  }

  keys() {
    return this[Symbol.iterator](KEYS);
  }

  values() {
    return this[Symbol.iterator](VALUES);
  }

  entries() {
    return this[Symbol.iterator](KEYS_VALUES);
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
  ) {
    for (const [key, value] of this) {
      callbackfn.call(thisArg, key, value, this);
    }
  }

  public get size() {
    return this.map.size;
  }

  public get [Symbol.toStringTag]() {
    return this.map[Symbol.toStringTag];
  }
}
