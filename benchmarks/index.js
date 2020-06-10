// @ts-check
/* eslint-env node */
/* global globalThis */
/* eslint-disable @typescript-eslint/no-var-requires */

const objectBuffer = require("../");
const Benchmark = require("benchmark");
const oneComment = require("./fixtures/oneComment.json");

const ARR_SIZE = 200;
const arrOfComments = new Array(ARR_SIZE);
arrOfComments.fill(oneComment, 0, ARR_SIZE - 1);

globalThis.externalArgs = {};

const suite = new Benchmark.Suite();

suite
  .add(`createObjectBuffer with ${ARR_SIZE} comments`, () => {
    objectBuffer.createObjectBuffer(globalThis.externalArgs, 1e7, {
      arrOfComments,
    });
  })
  .on("cycle", (event) => {
    console.log(String(event.target));
  })
  .run();
