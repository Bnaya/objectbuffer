/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

describe("equality.test tests. make sure our cache of proxies works", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0
  });

  test("equality.test tests", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { arr: [1, 2, 3, 4], obj: { a: 1 } },
      { useSharedArrayBuffer: false }
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

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`776`);
  });
});
