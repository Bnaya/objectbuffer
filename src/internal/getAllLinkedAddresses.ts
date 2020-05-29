import { ENTRY_TYPE } from "./entry-types";
import { hashMapGetPointersToFree } from "./hashmap/hashmap";
import { isKnownAddressValuePointer } from "./utils";
import {
  typeOnly_type_get,
  string_charsPointer_get,
  typeAndRc_refsCount_get,
  object_pointerToHashMap_get,
  array_dataspacePointer_get,
  array_length_get,
} from "./generatedStructs";
import { Heap } from "../structsGenerator/consts";

export function getAllLinkedAddresses(
  heap: Heap,
  ignoreRefCount: boolean,
  entryPointer: number
) {
  const leafAddresses: Set<number> = new Set<number>();
  const arcAddresses: Set<number> = new Set<number>();
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

  return { leafAddresses, arcAddresses };
}

function getAllLinkedAddressesStep(
  heap: Heap,
  ignoreRefCount: boolean,
  entryPointer: number,
  leafAddresses: Set<number>,
  arcAddresses: Set<number>,
  addressesToProcessQueue: number[]
) {
  if (
    isKnownAddressValuePointer(entryPointer) ||
    leafAddresses.has(entryPointer) ||
    arcAddresses.has(entryPointer)
  ) {
    return;
  }

  const entryType = typeOnly_type_get(heap, entryPointer);
  // to be used ONLY if the type has ref counter
  const refsCount = typeAndRc_refsCount_get(heap, entryPointer);

  switch (entryType) {
    case ENTRY_TYPE.NUMBER:
    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      leafAddresses.add(entryPointer);
      break;

    case ENTRY_TYPE.STRING:
      leafAddresses.add(string_charsPointer_get(heap, entryPointer));
      leafAddresses.add(entryPointer);
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      if (refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
        getObjectOrMapOrSetAddresses(
          heap,
          object_pointerToHashMap_get(heap, entryPointer),
          leafAddresses,
          addressesToProcessQueue
        );
      } else {
        arcAddresses.add(entryPointer);
      }
      break;

    case ENTRY_TYPE.ARRAY:
      if (refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
        leafAddresses.add(array_dataspacePointer_get(heap, entryPointer));
        const arrayLength = array_length_get(heap, entryPointer);
        for (let i = 0; i < arrayLength; i += 1) {
          const valuePointer =
            heap.Uint32Array[
              (array_dataspacePointer_get(heap, entryPointer) +
                i * Uint32Array.BYTES_PER_ELEMENT) /
                Uint32Array.BYTES_PER_ELEMENT
            ];

          addressesToProcessQueue.push(valuePointer);
        }
      } else {
        arcAddresses.add(entryPointer);
      }
      break;

    case ENTRY_TYPE.DATE:
      if (refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
      } else {
        arcAddresses.add(entryPointer);
      }
      break;

    default:
      throw new Error(ENTRY_TYPE[entryType] + " Not implemented yet");
  }
}

export function getObjectOrMapOrSetAddresses(
  heap: Heap,
  internalHashmapPointer: number,
  leafAddresses: Set<number>,
  addressesToProcessQueue: number[]
) {
  const { pointersToValuePointers, pointers } = hashMapGetPointersToFree(
    heap,
    internalHashmapPointer
  );

  for (const leafPointer of pointers) {
    leafAddresses.add(leafPointer);
  }

  for (const pointer of pointersToValuePointers) {
    addressesToProcessQueue.push(
      heap.Uint32Array[pointer / Uint32Array.BYTES_PER_ELEMENT]
    );
  }
}
