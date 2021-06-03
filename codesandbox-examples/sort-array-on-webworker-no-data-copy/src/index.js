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

  const resultChannel = new MessageChannel();

  resultChannel.port1.addEventListener("message", (messageEvent) => {
    if (messageEvent.data instanceof ArrayBuffer) {
      unstable_replaceUnderlyingArrayBuffer(myObjectBuffer, messageEvent.data);

      console.log("First post after sort", { ...myObjectBuffer.posts[0] });
    }
  });

  resultChannel.port1.start();

  // From this point, the arrayBuffer will be detached
  postMessage([arrayBuffer, resultChannel.port2], "*", [
    arrayBuffer,
    resultChannel.port2,
  ]);
}

/**
 * Due to codesandbox limitations,
 * worker side also runs on the main thread in this example
 */
function workerSide() {
  addEventListener("message", (ev) => {
    if (ev.data[1] instanceof MessagePort && ev.data[0] instanceof ArrayBuffer) {
      const port = ev.data[1];
      const ab = ev.data[0];

      const myObjectBufferInWorker = loadObjectBuffer(ab);

      myObjectBufferInWorker.posts.sort((postA, postB) => {
        if (postA.body > postB.body) {
          return 1;
        } else {
          return -1;
        }
      });

      port.postMessage(ab, [ab]);
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


document.querySelector('button').addEventListener("click", () => {
  main();
});
