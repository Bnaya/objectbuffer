import { getInternalAPI } from "./utils";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { decrementRefCountWithNum } from "./store";
import { getCacheFor } from "./stateModule";

/**
 * Dispose the given objectBuffer part, immediately reclaiming memory if applicable (arc = 0 etc)
 * To be used on systems that does not support FinalizationRegistry or for immediate and now eventual memory reclaiming
 *  @see processQueuedReclaims for systems that supports FinalizationRegistry
 */
export function reclaim(objectBufferPart: unknown) {
  const internalApi = getInternalAPI(objectBufferPart);

  const entryPointer = internalApi.getEntryPointer();

  const newRefCount = internalApi.destroy();
  getCacheFor(internalApi.getCarrier()).delete(entryPointer);

  const leafAddresses = new Set<number>();
  const arcAddresses = new Map<number, number>();

  if (newRefCount === 0) {
    getAllLinkedAddresses(
      internalApi.getCarrier().heap,
      false,
      entryPointer,
      leafAddresses,
      arcAddresses
    );

    const { allocator, heap } = internalApi.getCarrier();

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

// /**
//  * @todo
//  * Dispose the given objectBuffer part, and queue the memory for reclaiming if applicable
//  * To be used on systems that does not support FinalizationRegistry and for eventual, non-blocking memory reclaiming
//  *
//  * The given part should not be top level ObjectBuffer
//  */
// export function queueReclaim(objectBufferPart: unknown) {
//   const internalApi = getInternalAPI(objectBufferPart);

//   const entryPointer = internalApi.getEntryPointer();

//   const newRefCount = internalApi.destroy();
//   getCacheFor(internalApi.getCarrier()).delete(entryPointer);

//   const leafAddresses = new Set<number>();
//   const arcAddresses = new Map<number, number>();

//   if (newRefCount === 0) {
//     getAllLinkedAddresses(
//       internalApi.getCarrier().heap,
//       false,
//       entryPointer,
//       leafAddresses,
//       arcAddresses
//     );

//     const { allocator, heap } = internalApi.getCarrier();

//     for (const address of leafAddresses) {
//       allocator.free(address);
//     }

//     for (const [address, count] of arcAddresses) {
//       decrementRefCountWithNum(heap, address, count);
//     }

//     return true;
//   }

//   return false;
// }
