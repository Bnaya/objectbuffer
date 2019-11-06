import { WeakValueMap } from "./WeakValueMap";

const externalObjectsCache = new WeakMap<object, Map<number, any>>();

declare const FinalizationGroup: any;
declare const WeakRef: any;

export function getCacheFor(
  obj: object,
  externalFinalizer?: (key: number) => void
) {
  let map = externalObjectsCache.get(obj);

  if (!map) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    map = supportWeakRef()
      ? new WeakValueMap<number, any>(undefined, externalFinalizer)
      : new Map<number, any>();
    externalObjectsCache.set(obj, map);
  }

  return map;
}

function supportWeakRef() {
  return typeof WeakRef !== "undefined";
}
