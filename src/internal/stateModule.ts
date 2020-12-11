/* eslint-disable @typescript-eslint/ban-types */
/*
  Module that holds state
*/

import type { GlobalCarrier } from "./interfaces";
import { WeakValueMap } from "./WeakValueMap";

// this is state
const addressesNoLongerUsed = new WeakMap<GlobalCarrier, number[]>();

export function getAddressesNoLongerUsedArrayForCarrier(
  carrier: GlobalCarrier
) {
  let l = addressesNoLongerUsed.get(carrier);

  if (l === undefined) {
    l = [];
    addressesNoLongerUsed.set(carrier, l);
  }

  return l;
}

// this is state
const externalObjectsCache = new WeakMap<object, Map<number, any>>();

declare const FinalizationGroup: any;
declare const WeakRef: any;

export function getCacheFor<T extends {}>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: T,
  externalFinalizer?: (carrier: T, key: number) => void
) {
  let map = externalObjectsCache.get(obj);

  if (!map) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    map = supportWeakRef()
      ? new WeakValueMap<number, any>(
          undefined,
          externalFinalizer?.bind(null, obj)
        )
      : new Map<number, any>();

    externalObjectsCache.set(obj, map);
  }

  return map;
}

function supportWeakRef() {
  return (
    typeof WeakRef !== "undefined" &&
    (typeof FinalizationGroup !== "undefined" ||
      typeof FinalizationRegistry !== "undefined")
  );
}
