/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs } from "../";
import { resizeObjectBuffer, memoryStats } from "../internal/api";

describe("memoryStats test", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("memoryStats test", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 }
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 720,
        "used": 304,
      }
    `);
  });

  test("memoryStats after resize", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 2048, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 }
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1744,
        "used": 304,
      }
    `);

    resizeObjectBuffer(objectBuffer, 1024);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 720,
        "used": 304,
      }
    `);

    resizeObjectBuffer(objectBuffer, 768);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 464,
        "used": 304,
      }
    `);

    resizeObjectBuffer(objectBuffer, 2048);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1744,
        "used": 304,
      }
    `);
  });
});
