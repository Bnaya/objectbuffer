/* eslint-disable */

import * as objectbufferModule from "../src";
import { Post } from "./transferAndSortArray"

addEventListener("message", ev => {
  if (ev.data[0] instanceof ArrayBuffer) {
    const port: MessagePort = ev.data[1];
    const ab: ArrayBuffer = ev.data[0];

    const myObjectBufferInWorker = objectbufferModule.loadObjectBuffer(
      ab
    );

    myObjectBufferInWorker.posts.sort((postA: Post, postB: Post) => {
      if (postA.body > postB.body) {
        return 1;
      } else {
        return -1;
      }
    });

    console.log("before trnasfer", ab.byteLength);
    port.postMessage(ab, [ab]);
    console.log("after trnasfer", ab.byteLength);
  }
});
