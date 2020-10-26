/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats, disposeWrapperObject } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";
import {
  jestExpectNoUseAfterFreeSubset,
  jestExpectNoUseAfterFreePartsAreEqulesTheWhole,
} from "../internal/memoryAnalysisGraph/memoryGraphHelpers";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("no user after free tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({});

  test("basic 2", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 2048, {
      o: { b: { a: { v: [1] } } },
    });

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`1264`);

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

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`984`);
  });

  test("siblings", () => {
    const ob = createObjectBuffer(externalArgs, 2048, {
      str: "str1",
      o: { a1: [1, 2, 3], a2: [4, 5, 6] },
    });

    const { a1, a2 } = ob.o;

    disposeWrapperObject(ob.o);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ob.o = undefined;

    expect(a1).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `);
    expect(a2).toMatchInlineSnapshot(`
      Array [
        4,
        5,
        6,
      ]
    `);

    expect(ob).toMatchInlineSnapshot(`
      Object {
        "o": undefined,
        "str": "str1",
      }
    `);

    jestExpectNoUseAfterFreeSubset(ob);
    jestExpectNoUseAfterFreeSubset(a1);
    jestExpectNoUseAfterFreeSubset(a2);

    jestExpectNoUseAfterFreePartsAreEqulesTheWhole([ob, a1, a2]);
  });

  test("use after dispose", () => {
    const ob = createObjectBuffer(externalArgs, 2048, {
      str: "str1",
      o: { a1: [1, 2, 3], a2: [4, 5, 6] },
    });

    const { o } = ob;

    disposeWrapperObject(o);
    expect(() => {
      o.a1;
    }).toThrowErrorMatchingInlineSnapshot(`"WrapperDestroyed"`);
  });
});
