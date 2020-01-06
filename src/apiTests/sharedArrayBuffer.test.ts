/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";
import { memoryStats, disposeWrapperObject } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("SharedArrayBuffer tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0
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

  test("basic 2", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { o: { a: { a: { v: [1] } } } },
      { useSharedArrayBuffer: true }
    );

    const prev1 = objectBuffer.o;
    objectBuffer.o = undefined;

    const prev2 = prev1.a;
    const prev3 = prev1.a.a;
    disposeWrapperObject(prev1);
    // disposeWrapperObject(prev2);
    // disposeWrapperObject(prev3);

    // objectBuffer.arr = [{ bar: 666 }];

    // objectBuffer.arr = [];
    objectBuffer.o = undefined;

    // disposeWrapperObject(objectBuffer.arr);
    expect(prev2).toMatchInlineSnapshot(`
      Object {
        "a": Object {
          "v": Array [
            1,
          ],
        },
      }
    `);
    expect(prev3).toMatchInlineSnapshot(`
      Object {
        "v": Array [
          1,
        ],
      }
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "o": undefined,
      }
    `);

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`608`);
  });
});
