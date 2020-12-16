/* eslint-disable */
import { loadObjectBuffer } from "@bnaya/objectbuffer";

addEventListener("message", (ev) => {
  if (ev.data[0] instanceof ArrayBuffer) {
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
