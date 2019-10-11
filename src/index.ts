/**
 * Usage:
 *
 * ```js
 * import { ... } from "@bnaya/objectbuffer";
 * ```
 *
 * @module @bnaya/objectbuffer
 */ /** */

export {
  createObjectBuffer,
  resizeObjectBuffer,
  getUnderlyingArrayBuffer,
  loadObjectBuffer,
  replaceUnderlyingArrayBuffer,
  sizeOf
} from "./internal/api";
export { acquireLock, acquireLockWait, releaseLock } from "./internal/locks";
export type ExternalArgs = import("./internal/interfaces").ExternalArgs;
