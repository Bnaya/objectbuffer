/* eslint-disable no-undef */
import * as objectbufferModules from "../src";

import Worker from "worker-loader!./Worker.js";

/**
 * @type {objectbufferModules.ExternalArgs}
 */
const externalArgs = {
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
  arrayAdditionalAllocation: 0,
  minimumStringAllocation: 0
};

const o = objectbufferModules.createObjectBuffer(
  externalArgs,
  512,
  {
    some: {
      nested: [
        {
          thing: "im the value to follow"
        }
      ]
    }
  },
  { useSharedArrayBuffer: true }
);

// o.yetAnother = [234, 234, "asf"];

// console.log(JSON.stringify(o, null, 2));

const ab = objectbufferModules.getUnderlyingArrayBuffer(o);

const worker = new Worker();

worker.postMessage(ab);

// expose to console

window.theObjectBuffer = o;

const input = document.createElement("input");
const button = document.createElement("button");
input.type = "text";
button.textContent = "Send to the worker's console";
document.body.appendChild(input);
document.body.appendChild(button);

button.addEventListener("click", () => {
  if (objectbufferModules.locks.getLock(1, ab)) {
    o.some.nested[0].thing = input.value;

    if (!objectbufferModules.locks.releaseLock(1, ab)) {
      console.warn("releaseLock failed ??");
    }
  } else {
    console.warn("where is my lock ??");
  }
});
