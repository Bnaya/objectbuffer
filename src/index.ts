/**
 * Basic usage (Browser):
 *
 * ```js
[[include:docs/codeExamples/basicUsage.js]]
 * ```

 */ /** */

export {
  createObjectBuffer,
  getUnderlyingArrayBuffer,
  loadObjectBuffer,
  memoryStats,
  processQueuedReclaims,
  reclaim,
  queueReclaim,
  unstable_replaceUnderlyingArrayBuffer,
  unstable_resizeObjectBuffer,
  updateObjectBufferSettings,
} from "./internal/api";
export type { ObjectBufferSettings } from "./internal/interfaces";
export { acquireLock, acquireLockWait, releaseLock } from "./internal/locks";
