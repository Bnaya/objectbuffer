/* eslint-disable no-undef */
import * as objectbuffer from "../src";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

addEventListener("message", ev => {
  if (ev.data instanceof SharedArrayBuffer) {
    const o = objectbuffer.createObjectBufferFromArrayBuffer(
      textDecoder,
      textEncoder,
      ev.data,
      false
    );

    let lastValueToFollow = o.some.nested[0].thing;

    console.log("got SAB, first value is:", lastValueToFollow);

    setInterval(() => {
      if (lastValueToFollow !== o.some.nested[0].thing) {
        lastValueToFollow = o.some.nested[0].thing;
        console.log(lastValueToFollow);
      }
    }, 500);
  }
});
