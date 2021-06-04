/* eslint-env browser  */

async function mainThreadSide() {
  const arrayBuffer = new ArrayBuffer(Math.pow(8, 7));

  const resultChannel = new MessageChannel();

  resultChannel.port1.addEventListener("message", (messageEvent) => {
    if (messageEvent.data instanceof ArrayBuffer) {
      console.log("here");
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
 * Due to codesandbox limitations with real webworkers
 * worker side also runs on the main thread in this example
 */
function workerSide() {
  addEventListener("message", (ev) => {
    if (
      ev.data[1] instanceof MessagePort &&
      ev.data[0] instanceof ArrayBuffer
    ) {
      const port = ev.data[1];
      const ab = ev.data[0];

      port.postMessage(ab, [ab]);
    }
  });
}

workerSide();

function main() {
  mainThreadSide();
}

document.querySelector("button").addEventListener("click", () => {
  main();
});
