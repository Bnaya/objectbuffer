import { readEntry } from "./store";
import { ExternalArgs } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";

export function getAllLinkedAddresses(
  externalArgs: ExternalArgs,
  dataView: DataView,
  ignoreRefCount: boolean,
  entryPointer: number
) {
  const allAddresses: number[] = [];
  getAllLinkedAddressesStep(
    externalArgs,
    dataView,
    ignoreRefCount,
    entryPointer,
    allAddresses
  );

  return allAddresses;
}

function getAllLinkedAddressesStep(
  externalArgs: ExternalArgs,
  dataView: DataView,
  ignoreRefCount: boolean,
  entryPointer: number,
  pushTo: number[]
) {
  if (entryPointer === 0) {
    return;
  }

  const entry = readEntry(externalArgs, dataView, entryPointer);

  switch (entry.type) {
    case ENTRY_TYPE.UNDEFINED:
    case ENTRY_TYPE.NULL:
    case ENTRY_TYPE.BOOLEAN:
    case ENTRY_TYPE.NUMBER:
    case ENTRY_TYPE.STRING:
    case ENTRY_TYPE.BIGINT_NEGATIVE:
    case ENTRY_TYPE.BIGINT_POSITIVE:
      pushTo.push(entryPointer);
      break;

    case ENTRY_TYPE.OBJECT:
      if (entry.refsCount < 2 || ignoreRefCount) {
        pushTo.push(entryPointer);
        getAllLinkedAddressesStep(
          externalArgs,
          dataView,
          ignoreRefCount,
          entry.value,
          pushTo
        );
      }

      break;

    case ENTRY_TYPE.OBJECT_PROP:
      pushTo.push(entryPointer);

      if (entry.value.next !== 0) {
        getAllLinkedAddressesStep(
          externalArgs,
          dataView,
          ignoreRefCount,
          entry.value.next,
          pushTo
        );
      }

      if (entry.value.value !== 0) {
        getAllLinkedAddressesStep(
          externalArgs,
          dataView,
          ignoreRefCount,
          entry.value.value,
          pushTo
        );
      }
      break;

    case ENTRY_TYPE.ARRAY:
      if (entry.refsCount < 2 || ignoreRefCount) {
        pushTo.push(entryPointer);
        pushTo.push(entry.value);

        for (let i = 0; i < entry.allocatedLength; i += 1) {
          const valuePointer = dataView.getUint32(
            entry.value + i * Uint32Array.BYTES_PER_ELEMENT
          );
          if (valuePointer !== 0) {
            getAllLinkedAddressesStep(
              externalArgs,
              dataView,
              ignoreRefCount,
              valuePointer,
              pushTo
            );
          }
        }
      }
      break;

    case ENTRY_TYPE.DATE:
      if (entry.refsCount < 2 || ignoreRefCount) {
        pushTo.push(entryPointer);
      }
      break;

    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      throw new Error(ENTRY_TYPE[entry.type] + " Not implemented yet");
  }
}
