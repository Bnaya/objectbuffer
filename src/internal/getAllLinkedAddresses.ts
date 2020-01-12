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
  const leafAddresses: number[] = [];
  const arcAddresses: number[] = [];

  getAllLinkedAddressesStep(
    carrier,
    ignoreRefCount,
    entryPointer,
    leafAddresses,
    arcAddresses
  );

  return { leafAddresses, arcAddresses };
}

function getAllLinkedAddressesStep(
  carrier: GlobalCarrier,
  ignoreRefCount: boolean,
  entryPointer: number,
  leafAddresses: number[],
  arcAddresses: number[]
) {
  if (isKnownAddressValuePointer(entryPointer)) {
    return;
  }

  const entry = readEntry(carrier, entryPointer);

  switch (entry.type) {
    case ENTRY_TYPE.NUMBER:
    case ENTRY_TYPE.STRING:
    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      leafAddresses.push(entryPointer);
      break;

    case ENTRY_TYPE.OBJECT:
    case ENTRY_TYPE.MAP:
    case ENTRY_TYPE.SET:
      if (entry.refsCount <= 1 || ignoreRefCount) {
        leafAddresses.push(entryPointer);
        getObjectOrMapOrSetAddresses(
          carrier,
          ignoreRefCount,
          entry.value,
          leafAddresses,
          arcAddresses
        );
      } else {
        arcAddresses.push(entryPointer);
      }

      break;

    case ENTRY_TYPE.ARRAY:
      if (entry.refsCount <= 1 || ignoreRefCount) {
        leafAddresses.push(entryPointer);
        leafAddresses.push(entry.value);

        for (let i = 0; i < entry.allocatedLength; i += 1) {
          const valuePointer = carrier.dataView.getUint32(
            entry.value + i * Uint32Array.BYTES_PER_ELEMENT
          );

          getAllLinkedAddressesStep(
            carrier,
            ignoreRefCount,
            valuePointer,
            leafAddresses,
            arcAddresses
          );
        }
      } else {
        arcAddresses.push(entryPointer);
      }
      break;

    case ENTRY_TYPE.DATE:
      if (entry.refsCount <= 1 || ignoreRefCount) {
        leafAddresses.push(entryPointer);
      } else {
        arcAddresses.push(entryPointer);
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
  ignoreRefCount: boolean,
  internalHashmapPointer: number,
  leafAddresses: number[],
  arcAddresses: number[]
) {
  const { pointersToValuePointers, pointers } = hashMapGetPointersToFree(
    carrier.dataView,
    internalHashmapPointer
  );

  leafAddresses.push(...pointers);

  for (const pointer of pointersToValuePointers) {
    getAllLinkedAddressesStep(
      carrier,
      ignoreRefCount,
      carrier.dataView.getUint32(pointer),
      leafAddresses,
      arcAddresses
    );
  }
}
