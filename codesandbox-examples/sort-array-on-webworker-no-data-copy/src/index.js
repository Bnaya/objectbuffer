/* eslint-env browser  */

import {
  createObjectBuffer,
  getUnderlyingArrayBuffer,
  unstable_replaceUnderlyingArrayBuffer,
  loadObjectBuffer,
} from "@bnaya/objectbuffer";

async function mainThreadSide() {
  const data = await getData();

  const myObjectBuffer = createObjectBuffer(Math.pow(8, 7), {
    posts: data,
  });

  console.log("First post before sort", { ...myObjectBuffer.posts[0] });

  const arrayBuffer = getUnderlyingArrayBuffer(myObjectBuffer);

  const requestChannel = new BroadcastChannel("requestChannel");
  const resultChannel = new BroadcastChannel("resultChannel");

  resultChannel.addEventListener("message", (messageEvent) => {
    if (messageEvent.data instanceof ArrayBuffer) {
      unstable_replaceUnderlyingArrayBuffer(myObjectBuffer, messageEvent.data);

      console.log("First post after sort", { ...myObjectBuffer.posts[0] });
    }
  });

  // From this point, the arrayBuffer will be detached
  requestChannel.postMessage([arrayBuffer], "*", [arrayBuffer]);
}

/**
 * Due to codesandbox limitations with real webworkers
 * worker side also runs on the main thread in this example
 */
function workerSide() {
  const requestChannel = new BroadcastChannel("requestChannel");
  const resultChannel = new BroadcastChannel("resultChannel");

  requestChannel.addEventListener("message", (ev) => {
    if (ev.data[0] instanceof ArrayBuffer) {
      const ab = ev.data[0];

      const myObjectBufferInWorker = loadObjectBuffer(ab);

      myObjectBufferInWorker.posts.sort((postA, postB) => {
        if (postA.body > postB.body) {
          return 1;
        } else {
          return -1;
        }
      });

      resultChannel.postMessage(ab, [ab]);
    }
  });
}

workerSide();

function main() {
  mainThreadSide();
}

async function getData() {
  const data = await (
    await fetch("https://jsonplaceholder.typicode.com/comments")
  ).json();

  return data;
}

document.querySelector("button").addEventListener("click", () => {
  main();
});
