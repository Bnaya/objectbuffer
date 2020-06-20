import { decrementRefCount, decrementRefCountWithNum } from "./store";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { GlobalCarrier } from "./interfaces";
import { getAddressesNoLongerUsed } from "./stateModule";

/**
 * Possible optimization: write smarter algo that process all the addresses in one pass
 */
export function freeNoLongerUsedAddresses(carrier: GlobalCarrier) {
  const l = getAddressesNoLongerUsed(carrier);

  let memoryAddress;
  while ((memoryAddress = l.pop()) !== undefined) {
    const newRefsCount = decrementRefCount(carrier.heap, memoryAddress);
    if (newRefsCount === 0) {
      const freeUs = getAllLinkedAddresses(carrier.heap, false, memoryAddress);

      for (const address of freeUs.leafAddresses) {
        carrier.allocator.free(address);
      }

      for (const [address, count] of freeUs.arcAddresses) {
        decrementRefCountWithNum(carrier.heap, address, count);
      }
    }
  }
}
