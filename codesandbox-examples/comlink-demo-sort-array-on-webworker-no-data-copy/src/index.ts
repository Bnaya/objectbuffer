/* eslint-env browser  */
import {
  createObjectBuffer,
  loadObjectBuffer,
  unstable_replaceUnderlyingArrayBuffer,
  getUnderlyingArrayBuffer,
} from "@bnaya/objectbuffer";
import * as comlink from "comlink";

async function main() {
  workerSide();
  mainThreadSide();
}

async function mainThreadSide() {
  const data = await getData();
  const dataSize = 2 ** 20;

  const myObjectBuffer = createObjectBuffer(align(dataSize, 8), {
    posts: data,
  });
  console.log("First post before sort", { ...myObjectBuffer.posts[0] });

  const initialArrayBuffer = getUnderlyingArrayBuffer(myObjectBuffer);

  const sortArray = comlink.wrap<(transferWrapper: any) => ArrayBuffer>(
    comlink.windowEndpoint(window)
  );

  const arrayBufferBack = await sortArray(
    comlink.transfer(initialArrayBuffer, [initialArrayBuffer])
  );

  unstable_replaceUnderlyingArrayBuffer(myObjectBuffer, arrayBufferBack);

  console.log("First post after sort", { ...myObjectBuffer.posts[0] });
}

// Due to codesandbox limitations with webworker, the worker runs also on the main thread
function workerSide() {
  comlink.expose(sortArray, comlink.windowEndpoint(window));

  function sortArray(ab: ArrayBuffer) {
    const myObjectBufferInWorker = loadObjectBuffer(ab);

    myObjectBufferInWorker.posts.sort((postA: Post, postB: Post) => {
      if (postA.body > postB.body) {
        return 1;
      } else {
        return -1;
      }
    });

    return comlink.transfer(ab, [ab]);
  }
}

main();

function align(value: number, alignTo: number) {
  return value + alignTo - (value % alignTo);
}

interface Post {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

async function getData() {
  const data: Post[] = await (
    await fetch("https://jsonplaceholder.typicode.com/comments")
  ).json();

  return data;
}
