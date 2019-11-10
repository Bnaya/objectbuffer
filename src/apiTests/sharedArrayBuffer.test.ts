/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("SharedArrayBuffer tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  });

  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { arr: [{ a: 1 }] },
      { useSharedArrayBuffer: true }
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

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`440`);
  });
});
