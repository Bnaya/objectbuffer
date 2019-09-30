/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("SharedArrayBuffer tests", () => {
  const textEncoder = new util.TextEncoder();
  const textDecoder = new util.TextDecoder();

  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(
      textDecoder,
      textEncoder,
      1024,
      { arr: [{ a: 1 }] },
      { arrayAdditionalAllocation: 0, useSharedArrayBuffer: false }
    );

    objectBuffer.arr = [{ bar: 666 }];

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          Object {
            "bar": 666,
          },
        ],
      }
    `);
  });
});
