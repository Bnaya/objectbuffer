/* eslint-env jest */

import { createObjectBuffer } from "../";
import { resizeObjectBuffer, memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

describe("memoryStats test", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 0,
  });

  test("memoryStats test", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 },
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 328,
        "top": 696,
        "total": 1024,
        "used": 696,
      }
    `);
  });

  test("memoryStats after resize", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 2048, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 },
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1352,
        "top": 696,
        "total": 2048,
        "used": 696,
      }
    `);

    resizeObjectBuffer(objectBuffer, 1024);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 328,
        "top": 696,
        "total": 1024,
        "used": 696,
      }
    `);

    resizeObjectBuffer(objectBuffer, 768);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 72,
        "top": 696,
        "total": 768,
        "used": 696,
      }
    `);

    resizeObjectBuffer(objectBuffer, 2048);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1352,
        "top": 696,
        "total": 2048,
        "used": 696,
      }
    `);
  });
});
