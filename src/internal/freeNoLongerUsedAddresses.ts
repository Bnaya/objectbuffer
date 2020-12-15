import { decrementRefCount, decrementRefCountWithNum } from "./store";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { GlobalCarrier } from "./interfaces";
import { getAddressesNoLongerUsedArrayForCarrier } from "./stateModule";

/**
 * Possible optimization: write smarter algo that process all the addresses in one pass
 */
export function freeNoLongerUsedAddresses(carrier: GlobalCarrier) {
  const l = getAddressesNoLongerUsedArrayForCarrier(carrier);

  let memoryAddress;
  while ((memoryAddress = l.pop()) !== undefined) {
    const newRefsCount = decrementRefCount(carrier.heap, memoryAddress);
    if (newRefsCount === 0) {
      // @todo hoist it out of the loop
      const leafAddresses = new Set<number>();
      const arcAddresses = new Map<number, number>();

      getAllLinkedAddresses(
        carrier.heap,
        false,
        memoryAddress,
        leafAddresses,
        arcAddresses
      );

      for (const address of leafAddresses) {
        carrier.allocator.free(address);
      }

      for (const [address, count] of arcAddresses) {
        decrementRefCountWithNum(carrier.heap, address, count);
      }
    }
  }
}
