/* eslint-disable no-undef */
import * as objectbufferModule from "../src";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

addEventListener("message", ev => {
  let lastValueToFollow = "IM NOT INTERESTING";

  if (ev.data instanceof SharedArrayBuffer) {
    const o = objectbufferModule.createObjectBufferFromArrayBuffer(
      textDecoder,
      textEncoder,
      ev.data,
      false
    );

    const lockStatus = objectbufferModule.locks.waitForLock(2, ev.data, 1000);

    if (lockStatus === "have-lock") {
      lastValueToFollow = o.some.nested[0].thing;

      console.log("got SAB, first value is:", lastValueToFollow);
      if (!objectbufferModule.locks.releaseLock(2, ev.data)) {
        console.warn("failed releasing lock ??");
      }
    } else {
      console.warn("failed acquiring lock: " + lockStatus);
    }

    setInterval(() => {
      const lockStatusInner = objectbufferModule.locks.waitForLock(
        2,
        ev.data,
        1000
      );

      if (lockStatusInner === "have-lock") {
        if (lastValueToFollow !== o.some.nested[0].thing) {
          lastValueToFollow = o.some.nested[0].thing;
          console.log(lastValueToFollow);
        }
        if (!objectbufferModule.locks.releaseLock(2, ev.data)) {
          console.warn("failed releasing lock ??");
        }
      } else {
        console.warn("failed acquiring lock: " + lockStatusInner);
      }
    }, 500);
  }
});
