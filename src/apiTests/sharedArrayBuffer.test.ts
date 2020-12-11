/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats, reclaim } from "../internal/api";
import { jestExpectNoUseAfterFreeSubset } from "../internal/memoryAnalysisGraph/memoryGraphHelpers";

describe("SharedArrayBuffer tests", () => {
  test("reclaim", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {}, {}, "shared");

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`208`);
    objectBuffer.o = { a: undefined };
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`608`);
    reclaim(objectBuffer.o);
    objectBuffer.o = undefined;
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`328`);
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "o": undefined,
      }
    `);
    delete objectBuffer.o;
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`208`);
  });

  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(
      2048,
      { arr: [{ a: 1 }] },
      {},
      "shared"
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

    // reclaim(objectBuffer.arr[0]);
    // reclaim(objectBuffer.arr);

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

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`704`);

    reclaim(objectBuffer.arr[0]);
    reclaim(objectBuffer.arr);

    delete objectBuffer.arr;
    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`208`);
  });

  test("basic 2", () => {
    const objectBuffer = createObjectBuffer<any>(
      2048,
      { o: { b: { a: { v: [1] } } } },
      {},
      "shared"
    );

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`1264`);

    const prev1 = objectBuffer.o;
    objectBuffer.o = undefined;

    const prev2 = prev1.b;
    const prev3 = prev1.b.a;
    reclaim(prev1);
    // reclaim(prev2);
    // reclaim(prev3);

    // objectBuffer.arr = [{ bar: 666 }];

    // objectBuffer.arr = [];
    // console.log("98");
    objectBuffer.o = undefined;
    // console.log("100");

    // reclaim(objectBuffer.arr);
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

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`984`);
  });
});
