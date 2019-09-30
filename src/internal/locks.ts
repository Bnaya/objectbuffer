import { invariant } from "./utils";

/* global Atomics */

// I have no idea if its really works as i think it should

export function getLock(playerId: number, sab: SharedArrayBuffer) {
  invariant(playerId > 0, "playerId must be more than 0");

  const int32 = new Int32Array(sab);

  const oldValue = Atomics.compareExchange(int32, 0, 0, playerId);

  return oldValue === 0;
}

export function releaseLock(playerId: number, sab: SharedArrayBuffer) {
  const int32 = new Int32Array(sab);

  const oldValue = Atomics.compareExchange(int32, 0, playerId, 0);

  // we've released a lock. lets tell them about it
  if (oldValue === playerId) {
    Atomics.notify(int32, 0, +Infinity);

    return true;
  }

  return false;
}

export function waitForLock(
  playerId: number,
  sab: SharedArrayBuffer,
  timeout: number
) {
  const int32 = new Int32Array(sab);
  const oldValue = Atomics.compareExchange(int32, 0, 0, playerId);
  if (oldValue === 0) {
    return "have-lock";
  }

  const r = Atomics.wait(int32, 0, oldValue, timeout);

  if (r === "not-equal") {
    if (Atomics.compareExchange(int32, 0, 0, playerId) === 0) {
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
