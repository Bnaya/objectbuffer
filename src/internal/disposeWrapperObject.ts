import { getInternalAPI } from "./utils";
import { getCacheFor } from "./externalObjectsCache";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";

/**
 *  Dispose the given objectWrapper, and re-claim the memory
 *  This is not needed on systems that supports weak-refs
 */
export function disposeWrapperObject(value: any) {
  const internalApi = getInternalAPI(value);

  const entryPointer = internalApi.getEntryPointer();

  const newRefCount = internalApi.destroy();
  getCacheFor(internalApi.getCarrier()).delete(entryPointer);

  if (newRefCount === 0) {
    const addressesToFree = getAllLinkedAddresses(
      internalApi.getExternalArgs(),
      internalApi.getCarrier().dataView,
      false,
      entryPointer
    );

    for (const address of addressesToFree) {
      internalApi.getCarrier().allocator.free(address);
    }

    return true;
  }

  return false;
}
