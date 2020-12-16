/* eslint-disable */

// please check the console

import * as objectbufferModule from "@bnaya/objectbuffer";
import * as ComlinkModule from "comlink";

let objectbufferMUMDLocation = "https://unpkg.com/@bnaya/objectbuffer";
try {
  // @ts-ignore
  const objectbufferMaybeUMDOrVersionLocation = require("../package.json")
    .dependencies["@bnaya/objectbuffer"];

  // codesandbox ci
  if (objectbufferMaybeUMDOrVersionLocation.startsWith("https")) {
    objectbufferMUMDLocation = objectbufferMaybeUMDOrVersionLocation;
    // simple version
  } else {
    objectbufferMUMDLocation = `https://unpkg.com/@bnaya/objectbuffer@${objectbufferMaybeUMDOrVersionLocation}`;
  }
} catch {}
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
  const data: Post[] = await (await fetch(
    "https://jsonplaceholder.typicode.com/comments"
  )).json();

  return data;
}

const externalArgs: objectbufferModule.ExternalArgs = {};

async function main() {
  const data = await getData();
  const dataSize = 2 ** 20;

  const myObjectBuffer = objectbufferModule.createObjectBuffer(
    externalArgs,
    align(dataSize + 29, 8),
    {
      posts: data
    }
  );
  console.log("Initial", { ...myObjectBuffer.posts[0] });

  const initialArrayBuffer = objectbufferModule.getUnderlyingArrayBuffer(
    myObjectBuffer
  );

  const sortArray = ComlinkModule.wrap<(transferWrapper: any) => ArrayBuffer>(
    new Worker(
      /**
       *  trick to load worker in sandbpx
       */
      `data:application/javascript;base64,${btoa(
        `(${workerCode.toString()})(${JSON.stringify(
          objectbufferMUMDLocation
        )})`
      )}`,
      {
        name: "exampleWorker"
      }
    )
  );

  const arrayBufferBack = await sortArray(
    ComlinkModule.transfer(initialArrayBuffer, [initialArrayBuffer])
  );

  objectbufferModule.replaceUnderlyingArrayBuffer(
    myObjectBuffer,
    arrayBufferBack
  );

  console.log("After Sort", { ...myObjectBuffer.posts[0] });
}

main();

/**
 *  trick to load worker in sandbpx
 */
function workerCode(localObjectbufferMUMDLocation: string) {
  importScripts(
    localObjectbufferMUMDLocation ||
      "https://unpkg.com/@bnaya/objectbuffer@0.10.0/dist/objectbuffer.umd.js"
  );
  importScripts("https://unpkg.com/comlink@4");

  let objectbufferModuleInWorker: typeof import("@bnaya/objectbuffer");

  // @ts-ignore
  objectbufferModuleInWorker = self.objectbuffer;

  const ComlinkModuleInWorker: typeof import("comlink") = (self as any).Comlink;

  ComlinkModuleInWorker.expose(sortArray);

  function sortArray(ab: ArrayBuffer) {
    const externalArgs: objectbufferModule.ExternalArgs = {};

    const myObjectBufferInWorker = objectbufferModuleInWorker.loadObjectBuffer(
      externalArgs,
      ab
    );

    myObjectBufferInWorker.posts.sort((postA: Post, postB: Post) => {
      if (postA.body > postB.body) {
        return 1;
      } else {
        return -1;
      }
    });

    return ComlinkModuleInWorker.transfer(ab, [ab]);
  }
}
