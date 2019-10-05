/* eslint-disable no-undef */
import * as objectbufferModule from "../src";

/**
 * @type {objectbufferModules.ExternalArgs}
 */
const externalArgs = {
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
  arrayAdditionalAllocation: 0,
  minimumStringAllocation: 0
};

addEventListener("message", ev => {
  let lastValueToFollow = "IM NOT INTERESTING";

  if (ev.data instanceof SharedArrayBuffer) {
    const o = objectbufferModule.createObjectBufferFromArrayBuffer(
      externalArgs,
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
