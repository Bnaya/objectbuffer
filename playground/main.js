/* eslint-disable no-undef */
import * as objectbuffer from "../src";

import Worker from "worker-loader!./Worker.js";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

const o = objectbuffer.createObjectBuffer(
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

const ab = objectbuffer.getUnderlyingArrayBuffer(o);

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
  o.some.nested[0].thing = input.value;
});
