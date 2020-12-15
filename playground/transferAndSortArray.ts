/* eslint-disable */

import * as objectbufferModule from "../src"

// @ts-ignore
import Worker from "worker-loader!./transferAndSortArrayWorker.ts";

export interface Post {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

async function getData() {
  const data: Post[] = await (await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  )).json();

  return data;
}

async function main() {
  const data = await getData();

  const dataSize = 10 * 10000000

  const myObjectBuffer = objectbufferModule.createObjectBuffer(
    dataSize * 1.15,
    {
      posts: data
    }
  );

  console.log("Initial", { ...myObjectBuffer.posts[0] });

  const ab = objectbufferModule.getUnderlyingArrayBuffer(myObjectBuffer);


  const myWorker = Worker();

  const resultChannel = new MessageChannel();

  resultChannel.port1.addEventListener("message", messageEvent => {
    if (messageEvent.data instanceof ArrayBuffer) {
      console.log("Got AB", messageEvent.data.byteLength);
      objectbufferModule.unstable_replaceUnderlyingArrayBuffer(
        myObjectBuffer,
        messageEvent.data
      );

      console.log("After Sort", { ...myObjectBuffer.posts[0] });
    }
  });

  resultChannel.port1.start();

  myWorker.postMessage([ab, resultChannel.port2], [ab, resultChannel.port2]);
}

main();
