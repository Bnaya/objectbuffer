/* istanbul ignore file */

// I'm not sure how to test that yet

import { invariant } from "./utils";
import { getUnderlyingArrayBuffer } from "./api";
import { GLOBAL_LOCK_OFFSET } from "./consts";

/* global Atomics */

// I have no idea if its really works as i think it should

/**
 * Tries to acquire a lock on the given objectBuffer, as the given agentId.
 *
 * @param agentId
 * @param objectBuffer
 */
export function acquireLock(agentId: number, objectBuffer: any) {
  const sab = getUnderlyingArrayBuffer(objectBuffer);

  invariant(agentId > 0, "agentId must be more than 0");

  const int32 = new Int32Array(sab);

  const oldValue = Atomics.compareExchange(
    int32,
    GLOBAL_LOCK_OFFSET,
    0,
    agentId
  );

  return oldValue === 0;
}

/**
 *  Try to release a lock acquired by [[acquireLock]] or [[acquireLockWait]]
 *
 * @param agentId
 * @param sab
 */
export function releaseLock(agentId: number, objectBuffer: any) {
  const sab = getUnderlyingArrayBuffer(objectBuffer);
  const int32 = new Int32Array(sab);

  const oldValue = Atomics.compareExchange(
    int32,
    GLOBAL_LOCK_OFFSET,
    agentId,
    0
  );

  // we've released a lock. lets tell them about it
  if (oldValue === agentId) {
    Atomics.notify(int32, 0, +Infinity);

    return true;
  }

  return false;
}

/**
 *  Try to get a lock on a the given objectBuffer, or wait until timeout
 *  Will Not work on the main thread.
 *  Use only on workers
 *  Only when `"have-lock"` returned you actually got the lock
 *
 *  Uses https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait under the hood
 *
 * @param agentId
 * @param objectBuffer
 * @param timeout
 */

export function acquireLockWait(
  agentId: number,
  objectBuffer: any,
  timeout: number
) {
  const sab = getUnderlyingArrayBuffer(objectBuffer);
  const int32 = new Int32Array(sab);
  const oldValue = Atomics.compareExchange(
    int32,
    GLOBAL_LOCK_OFFSET,
    0,
    agentId
  );
  if (oldValue === 0) {
    return "have-lock";
  }

  const r = Atomics.wait(int32, 0, oldValue, timeout);

  if (r === "not-equal") {
    if (Atomics.compareExchange(int32, GLOBAL_LOCK_OFFSET, 0, agentId) === 0) {
      return "have-lock";
    } else {
      return "miss-lock";
    }
  } else if (r === "timed-out") {
    return "timed-out";
  } else {
    return "no-lock";
  }
}
