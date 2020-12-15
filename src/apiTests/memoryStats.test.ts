/* eslint-env jest */

import { createObjectBuffer } from "../";
import { unstable_resizeObjectBuffer, memoryStats } from "../internal/api";

describe("memoryStats test", () => {
  test("memoryStats test", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 },
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 64,
        "top": 960,
        "total": 1024,
        "used": 960,
      }
    `);
  });

  test("memoryStats after resize", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 },
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1088,
        "top": 960,
        "total": 2048,
        "used": 960,
      }
    `);

    unstable_resizeObjectBuffer(objectBuffer, 1024);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 64,
        "top": 960,
        "total": 1024,
        "used": 960,
      }
    `);

    unstable_resizeObjectBuffer(objectBuffer, 960);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 0,
        "top": 960,
        "total": 960,
        "used": 960,
      }
    `);

    unstable_resizeObjectBuffer(objectBuffer, 2048);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1088,
        "top": 960,
        "total": 2048,
        "used": 960,
      }
    `);
  });
});
