import { readEntry } from "./store";
import { GlobalCarrier } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { hashMapGetPointersToFree } from "./hashmap/hashmap";
import { isKnownAddressValuePointer } from "./utils";

export function getAllLinkedAddresses(
  carrier: GlobalCarrier,
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
      carrier,
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
  carrier: GlobalCarrier,
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

  const entry = readEntry(carrier, entryPointer);

  switch (entry.type) {
    case ENTRY_TYPE.NUMBER:
    case ENTRY_TYPE.STRING:
    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      leafAddresses.add(entryPointer);
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      if (entry.refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
        getObjectOrMapOrSetAddresses(
          carrier,
          entry.value,
          leafAddresses,
          addressesToProcessQueue
        );
      } else {
        arcAddresses.add(entryPointer);
      }

      break;

    case ENTRY_TYPE.ARRAY:
      if (entry.refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
        leafAddresses.add(entry.value);

        for (let i = 0; i < entry.allocatedLength; i += 1) {
          const valuePointer =
            carrier.uint32[
              (entry.value + i * Uint32Array.BYTES_PER_ELEMENT) /
                Uint32Array.BYTES_PER_ELEMENT
            ];

          addressesToProcessQueue.push(valuePointer);
        }
      } else {
        arcAddresses.add(entryPointer);
      }
      break;

    case ENTRY_TYPE.DATE:
      if (entry.refsCount <= 1 || ignoreRefCount) {
        leafAddresses.add(entryPointer);
      } else {
        arcAddresses.add(entryPointer);
      }
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }
}

export function getObjectOrMapOrSetAddresses(
  carrier: GlobalCarrier,
  internalHashmapPointer: number,
  leafAddresses: Set<number>,
  addressesToProcessQueue: number[]
) {
  const { pointersToValuePointers, pointers } = hashMapGetPointersToFree(
    carrier,
    internalHashmapPointer
  );

  for (const leafPointer of pointers) {
    leafAddresses.add(leafPointer);
  }

  for (const pointer of pointersToValuePointers) {
    addressesToProcessQueue.push(
      carrier.uint32[pointer / Uint32Array.BYTES_PER_ELEMENT]
    );
  }
}
