import { getFirstFreeByte } from "./utils";
import { FIRST_FREE_BYTE_POINTER_TO_POINTER } from "./consts";

/**
 * Catches if the operation inside CB throw OOM exception,
 * and if it did, restore the firstFreeByte & set everything to zero.
 *
 * For cases when we got oom in the middle of saving object, array, etc
 */
export function handleOOM(operation: () => void, dataView: DataView) {
  const prevFirstFreeByte = getFirstFreeByte(dataView.buffer);
  try {
    operation();
  } catch (e) {
    const currentFirstFreeByte = getFirstFreeByte(dataView.buffer);

    // restore prev state before the OOM operation
    if (prevFirstFreeByte !== currentFirstFreeByte) {
      dataView.setUint32(FIRST_FREE_BYTE_POINTER_TO_POINTER, prevFirstFreeByte);

      for (let i = prevFirstFreeByte; i <= currentFirstFreeByte; i += 1) {
        dataView.setUint8(i, 0);
      }
    }

    throw e;
  }
}
