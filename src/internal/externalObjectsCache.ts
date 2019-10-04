const externalObjectsCache = new WeakMap<object, Map<number, any>>();

export function getCacheFor(obj: object) {
  let map = externalObjectsCache.get(obj);

  if (!map) {
    map = new Map<number, any>();
    externalObjectsCache.set(obj, map);
  }

  return map;
}
