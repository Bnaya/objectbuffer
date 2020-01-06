/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";
import { resizeObjectBuffer, memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

describe("memoryStats test", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0
  });

  test("memoryStats test", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 }
    });

    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 424,
        "used": 600,
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
        "available": 1448,
        "used": 600,
      }
    `);

    resizeObjectBuffer(objectBuffer, 1024);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 424,
        "used": 600,
      }
    `);

    resizeObjectBuffer(objectBuffer, 768);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 168,
        "used": 600,
      }
    `);

    resizeObjectBuffer(objectBuffer, 2048);
    expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
      Object {
        "available": 1448,
        "used": 600,
      }
    `);
  });
});
