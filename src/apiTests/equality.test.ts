/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

describe("equality.test tests. make sure our cache of proxies works", () => {
  test("equality.test tests", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 },
    });

    objectBuffer.arr2 = objectBuffer.arr;
    objectBuffer.obj2 = objectBuffer.obj;

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

    expect(objectBuffer.arr2).toBe(objectBuffer.arr2);
    expect(objectBuffer.arr2).toBe(objectBuffer.arr);

    expect(objectBuffer.obj2).toBe(objectBuffer.obj2);
    expect(objectBuffer.obj2).toBe(objectBuffer.obj);

    expect(memoryStats(objectBuffer).used).toMatchInlineSnapshot(`1200`);
  });
});
