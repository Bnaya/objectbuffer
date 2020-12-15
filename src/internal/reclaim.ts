import { getInternalAPI } from "./utils";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { decrementRefCount, decrementRefCountWithNum } from "./store";
import {
  getAddressesNoLongerUsedArrayForCarrier,
  getCacheFor,
} from "./stateModule";

/**
 * Dispose the given objectBuffer part, make it not usable anymore,
 * immediately reclaiming memory if applicable (arc = 0 etc)
 * To be used on systems that does not support FinalizationRegistry or for immediate and not eventual memory reclaiming
 */
export function reclaim(objectBufferPart: unknown) {
  const internalApi = getInternalAPI(objectBufferPart);
  const entryPointer = internalApi.getEntryPointer();
  const carrier = internalApi.getCarrier();
  internalApi.destroy();
  const newRefCount = decrementRefCount(carrier.heap, entryPointer);

  getCacheFor(carrier).delete(entryPointer);

  const leafAddresses = new Set<number>();
  const arcAddresses = new Map<number, number>();

  if (newRefCount === 0) {
    getAllLinkedAddresses(
      carrier.heap,
      false,
      entryPointer,
      leafAddresses,
      arcAddresses
    );

    const { allocator, heap } = carrier;

    for (const address of leafAddresses) {
      allocator.free(address);
    }

    for (const [address, count] of arcAddresses) {
      decrementRefCountWithNum(heap, address, count);
    }

    return true;
  }

  return false;
}

/**
 * Similar to reclaim, Dispose the given objectBuffer part, make it not usable anymore,
 * but only queue the memory for later reclaiming
 *  @see processQueuedReclaims for actually processing the reclaim
 *
 * The given part should not be top level ObjectBuffer
 */
export function queueReclaim(objectBufferPart: unknown) {
  const internalApi = getInternalAPI(objectBufferPart);

  const entryPointer = internalApi.getEntryPointer();

  internalApi.destroy();
  const carrier = internalApi.getCarrier();
  getCacheFor(internalApi.getCarrier()).delete(entryPointer);

  getAddressesNoLongerUsedArrayForCarrier(carrier).push(entryPointer);
}
