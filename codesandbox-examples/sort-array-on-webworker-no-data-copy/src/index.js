/* eslint-disable */

import DemoWorker from "worker-loader!./worker.js";
import * as objectbufferModule from "@bnaya/objectbuffer";


main();

async function main() {
  const data = await getData();
  const myWorker = new DemoWorker();

  const myObjectBuffer = objectbufferModule.createObjectBuffer(
    Math.pow(8, 7),
    {
      posts: data
    }
  );

  console.log("Before sort first post", { ...myObjectBuffer.posts[0] });

  const ab = objectbufferModule.getUnderlyingArrayBuffer(myObjectBuffer);

  const resultChannel = new MessageChannel();

  resultChannel.port1.addEventListener("message", messageEvent => {
    if (messageEvent.data instanceof ArrayBuffer) {
      objectbufferModule.unstable_replaceUnderlyingArrayBuffer(
        myObjectBuffer,
        messageEvent.data
      );

      console.log("After sort first post", { ...myObjectBuffer.posts[0] });
    }
  });

  resultChannel.port1.start();

  myWorker.postMessage([ab, resultChannel.port2], [ab, resultChannel.port2]);
}

async function getData() {
  const data = await (await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  )).json();

  return data;
}

document.body.append('Open console to see results')
