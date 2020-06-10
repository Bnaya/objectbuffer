// @ts-check

/* eslint-disable no-undef */
import * as objectbufferModule from "../src";

/**
 * @type {objectbufferModule.ExternalArgs}
 */
const externalArgs = {
  arrayAdditionalAllocation: 0,
};

addEventListener("message", (ev) => {
  let lastValueToFollow = "IM NOT INTERESTING";

  if (ev.data instanceof SharedArrayBuffer) {
    const ob = objectbufferModule.loadObjectBuffer(externalArgs, ev.data);

    const lockStatus = objectbufferModule.acquireLockWait(2, ob, 1000);

    if (lockStatus === "have-lock") {
      lastValueToFollow = ob.some.nested[0].thing;

      console.log("got SAB, first value is:", lastValueToFollow);
      if (!objectbufferModule.releaseLock(2, ob)) {
        console.warn("failed releasing lock ??");
      }
    } else {
      console.warn("failed acquiring lock: " + lockStatus);
    }

    setInterval(() => {
      const lockStatusInner = objectbufferModule.acquireLockWait(2, ob, 1000);

      if (lockStatusInner === "have-lock") {
        if (lastValueToFollow !== ob.some.nested[0].thing) {
          lastValueToFollow = ob.some.nested[0].thing;
          console.log(lastValueToFollow);
        }
        if (!objectbufferModule.releaseLock(2, ob)) {
          console.warn("failed releasing lock ??");
        }
      } else {
        console.warn("failed acquiring lock: " + lockStatusInner);
      }
    }, 500);
  }
});
