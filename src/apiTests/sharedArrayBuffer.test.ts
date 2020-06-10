/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats, disposeWrapperObject } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";
import { jestExpectNoUseAfterFreeSubset } from "../internal/memoryAnalysisGraph/memoryGraphHelpers";

describe("SharedArrayBuffer tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 0,
  });

  test("disposeWrapperObject", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      {},
      { useSharedArrayBuffer: true }
    );

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`160`);
    objectBuffer.o = { a: undefined };
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`456`);
    disposeWrapperObject(objectBuffer.o);
    objectBuffer.o = undefined;
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`248`);
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "o": undefined,
      }
    `);
    delete objectBuffer.o;
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`160`);
  });

  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { arr: [{ a: 1 }] },
      { useSharedArrayBuffer: true }
    );

    // expect(objectBuffer).toMatchInlineSnapshot(`
    //   Object {
    //     "arr": Array [
    //       Object {
    //         "a": 1,
    //       },
    //     ],
    //   }
    // `);

    // disposeWrapperObject(objectBuffer.arr[0]);
    // disposeWrapperObject(objectBuffer.arr);

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

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`528`);

    disposeWrapperObject(objectBuffer.arr[0]);
    disposeWrapperObject(objectBuffer.arr);

    delete objectBuffer.arr;
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`160`);
  });

  test("basic 2", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { o: { b: { a: { v: [1] } } } },
      { useSharedArrayBuffer: true }
    );

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`944`);

    const prev1 = objectBuffer.o;
    objectBuffer.o = undefined;

    const prev2 = prev1.b;
    const prev3 = prev1.b.a;
    disposeWrapperObject(prev1);
    // disposeWrapperObject(prev2);
    // disposeWrapperObject(prev3);

    // objectBuffer.arr = [{ bar: 666 }];

    // objectBuffer.arr = [];
    // console.log("98");
    objectBuffer.o = undefined;
    // console.log("100");

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

    jestExpectNoUseAfterFreeSubset(objectBuffer);
    jestExpectNoUseAfterFreeSubset(prev2);
    jestExpectNoUseAfterFreeSubset(prev3);

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`736`);
  });
});
