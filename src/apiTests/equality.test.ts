/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";
import { getFirstFreeByte } from "../internal/testUtils";
import { getUnderlyingArrayBuffer } from "../internal/api";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("equality.test tests", () => {
  const textEncoder = new util.TextEncoder();
  const textDecoder = new util.TextDecoder();

  test("equality.test tests", () => {
    const objectBuffer = createObjectBuffer<any>(
      textDecoder,
      textEncoder,
      1024,
      { arr: [1, 2, 3, 4], obj: { a: 1 } },
      { arrayAdditionalAllocation: 0, useSharedArrayBuffer: false }
    );

    objectBuffer.arr2 = objectBuffer.arr;
    objectBuffer.obj2 = objectBuffer.obj;

    expect(objectBuffer.arr2).toBe(objectBuffer.arr2);
    expect(objectBuffer.arr2).toBe(objectBuffer.arr);

    expect(objectBuffer.obj2).toBe(objectBuffer.obj2);
    expect(objectBuffer.obj2).toBe(objectBuffer.obj);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          1,
          2,
          3,
          4,
        ],
        "arr2": Array [
          1,
          2,
          3,
          4,
        ],
        "obj": Object {
          "a": 1,
        },
        "obj2": Object {
          "a": 1,
        },
      }
    `);

    expect(
      getFirstFreeByte(getUnderlyingArrayBuffer(objectBuffer))
    ).toMatchInlineSnapshot(`178`);
  });
});
