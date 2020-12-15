// @ts-check

/* eslint-disable no-undef */
import * as objectbufferModules from "../src";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Worker from "worker-loader!./Worker.js";

const ob = objectbufferModules.createObjectBuffer(
  1024,
  {
    some: {
      nested: [
        {
          thing: "im the value to follow",
        },
      ],
    },
  },
  {},
  "shared"
);

// o.yetAnother = [234, 234, "asf"];

// console.log(JSON.stringify(o, null, 2));

const ab = objectbufferModules.getUnderlyingArrayBuffer(ob);

const worker = new Worker();

worker.postMessage(ab);

// expose to the console
globalThis.theObjectBuffer = ob;

const input = document.createElement("input");
const button = document.createElement("button");
input.type = "text";
button.textContent = "Send to the worker's console";
document.body.appendChild(input);
document.body.appendChild(button);

button.addEventListener("click", () => {
  if (
    ab instanceof SharedArrayBuffer &&
    objectbufferModules.acquireLock(1, ob)
  ) {
    ob.some.nested[0].thing = input.value;

    if (!objectbufferModules.releaseLock(1, ob)) {
      console.warn("releaseLock failed ??");
    }
  } else {
    console.warn("where is my lock ??");
  }
});
