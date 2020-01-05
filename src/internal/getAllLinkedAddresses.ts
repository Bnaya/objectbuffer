import { readEntry } from "./store";
import { ExternalArgs } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";
import { hashMapGetPointersToFree } from "./hashmap/hashmap";
import {
  UNDEFINED_KNOWN_ADDRESS,
  NULL_KNOWN_ADDRESS,
  TRUE_KNOWN_ADDRESS,
  FALSE_KNOWN_ADDRESS
} from "./consts";

export function getAllLinkedAddresses(
  externalArgs: ExternalArgs,
  dataView: DataView,
  ignoreRefCount: boolean,
  entryPointer: number
) {
  const leafAddresses: number[] = [];
  const arcAddresses: number[] = [];

  getAllLinkedAddressesStep(
    externalArgs,
    dataView,
    ignoreRefCount,
    entryPointer,
    leafAddresses,
    arcAddresses
  );

  return { leafAddresses, arcAddresses };
}

function getAllLinkedAddressesStep(
  externalArgs: ExternalArgs,
  dataView: DataView,
  ignoreRefCount: boolean,
  entryPointer: number,
  leafAddresses: number[],
  arcAddresses: number[]
) {
  if (
    entryPointer === UNDEFINED_KNOWN_ADDRESS ||
    entryPointer === NULL_KNOWN_ADDRESS ||
    entryPointer === TRUE_KNOWN_ADDRESS ||
    entryPointer === FALSE_KNOWN_ADDRESS
  ) {
    return;
  }

  const entry = readEntry(externalArgs, dataView, entryPointer);

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
          externalArgs,
          dataView,
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
          const valuePointer = dataView.getUint32(
            entry.value + i * Uint32Array.BYTES_PER_ELEMENT
          );

          getAllLinkedAddressesStep(
            externalArgs,
            dataView,
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
  externalArgs: ExternalArgs,
  dataView: DataView,
  ignoreRefCount: boolean,
  internalHashmapPointer: number,
  leafAddresses: number[],
  arcAddresses: number[]
) {
  const { pointersToValuePointers, pointers } = hashMapGetPointersToFree(
    dataView,
    internalHashmapPointer
  );

  leafAddresses.push(...pointers);

  for (const pointer of pointersToValuePointers) {
    getAllLinkedAddressesStep(
      externalArgs,
      dataView,
      ignoreRefCount,
      dataView.getUint32(pointer),
      leafAddresses,
      arcAddresses
    );
  }
}
