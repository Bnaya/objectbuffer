import { getInternalAPI } from "./utils";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { decrementRefCountWithNum } from "./store";
import { getCacheFor } from "./stateModule";

/**
 *  Dispose the given objectWrapper, and re-claim the memory
 *  @see collectGarbage for systems that supports WeakRef
 *
 */
export function disposeWrapperObject(value: any) {
  const internalApi = getInternalAPI(value);

  const entryPointer = internalApi.getEntryPointer();

  const newRefCount = internalApi.destroy();
  getCacheFor(internalApi.getCarrier()).delete(entryPointer);

  if (newRefCount === 0) {
    const addressesToFree = getAllLinkedAddresses(
      internalApi.getCarrier().heap,
      false,
      entryPointer
    );

    const { allocator, heap } = internalApi.getCarrier();

    for (const address of addressesToFree.leafAddresses) {
      allocator.free(address);
    }

    for (const [address, count] of addressesToFree.arcAddresses) {
      decrementRefCountWithNum(heap, address, count);
    }

    return true;
  }

  return false;
}
