import { ENTRY_TYPE } from "./entry-types";
import { hashMapGetPointersToFreeV2 } from "./hashmap/hashmap";
import { isKnownAddressValuePointer } from "./utils";
import {
  typeOnly_type_get,
  string_charsPointer_get,
  typeAndRc_refsCount_get,
  object_pointerToHashMap_get,
  array_dataspacePointer_get,
  array_length_get,
} from "./generatedStructs";
import type { Heap } from "../structsGenerator/consts";

export function getAllLinkedAddresses(
  heap: Heap,
  ignoreRefCount: boolean,
  entryPointer: number,
  leafAddresses: Set<number>,
  arcAddresses: Map<number, number>
): void {
  const addressesToProcessQueue: number[] = [entryPointer];

  let addressToProcess: number | undefined = undefined;

  // const diffs = [];

  while ((addressToProcess = addressesToProcessQueue.shift()) !== undefined) {
    // const before = addressesToProcessQueue.slice();

    if (addressToProcess === 0) {
      continue;
    }

    getAllLinkedAddressesStep(
      heap,
      ignoreRefCount,
      addressToProcess,
      leafAddresses,
      arcAddresses,
      addressesToProcessQueue
    );

    // diffs.push(addressesToProcessQueue.filter((p) => !before.includes(p)));
  }

  // console.log(diffs);
}

function getAllLinkedAddressesStep(
  heap: Heap,
  ignoreRefCount: boolean,
  entryPointer: number,
  leafAddresses: Set<number>,
  arcAddresses: Map<number, number>,
  addressesToProcessQueue: number[]
) {
  if (
    isKnownAddressValuePointer(entryPointer) ||
    leafAddresses.has(entryPointer)
  ) {
    return;
  }

  if (arcAddresses.has(entryPointer)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    arcAddresses.set(entryPointer, arcAddresses.get(entryPointer)! + 1);
  }

  const entryType = typeOnly_type_get(heap, entryPointer);
  // to be used ONLY if the type has ref counter
  const refsCount =
    typeAndRc_refsCount_get(heap, entryPointer) -
    (arcAddresses.get(entryPointer) || 0);

  switch (entryType) {
    case ENTRY_TYPE.NUMBER:
    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      leafAddresses.add(entryPointer);
      break;

    case ENTRY_TYPE.STRING:
      if (refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(string_charsPointer_get(heap, entryPointer));
        leafAddresses.add(entryPointer);
        arcAddresses.delete(entryPointer);
      } else {
        arcAddresses.set(entryPointer, 1);
      }
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      if (refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
        arcAddresses.delete(entryPointer);
        getObjectOrMapOrSetAddresses(
          heap,
          object_pointerToHashMap_get(heap, entryPointer),
          leafAddresses,
          addressesToProcessQueue
        );
      } else {
        arcAddresses.set(entryPointer, 1);
      }
      break;

    case ENTRY_TYPE.ARRAY:
      if (refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
        leafAddresses.add(array_dataspacePointer_get(heap, entryPointer));
        arcAddresses.delete(entryPointer);

        const arrayLength = array_length_get(heap, entryPointer);
        for (let i = 0; i < arrayLength; i += 1) {
          const valuePointer =
            heap.u32[
              (array_dataspacePointer_get(heap, entryPointer) +
                i * Uint32Array.BYTES_PER_ELEMENT) /
                Uint32Array.BYTES_PER_ELEMENT
            ];

          addressesToProcessQueue.push(valuePointer);
        }
      } else {
        arcAddresses.set(entryPointer, 1);
      }
      break;

    case ENTRY_TYPE.DATE:
      if (refsCount <= 1 || ignoreRefCount) {
        arcAddresses.delete(entryPointer);
        leafAddresses.add(entryPointer);
      } else {
        arcAddresses.set(entryPointer, 1);
      }
      break;
  }
}

export function getObjectOrMapOrSetAddresses(
  heap: Heap,
  internalHashmapPointer: number,
  leafAddresses: Set<number>,
  addressesToProcessQueue: number[]
) {
  hashMapGetPointersToFreeV2(
    heap,
    internalHashmapPointer,
    leafAddresses,
    addressesToProcessQueue
  );
}
