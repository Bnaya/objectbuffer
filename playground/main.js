/* eslint-disable no-undef */
import * as objectbufferModules from "../src";

import Worker from "worker-loader!./Worker.js";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

const o = objectbufferModules.createObjectBuffer(
  textDecoder,
  textEncoder,
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
  { arrayAdditionalAllocation: 5, useSharedArrayBuffer: true }
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
