import { ExternalArgs } from "../internal/interfaces";
import * as util from "util";
import { createObjectBuffer } from "..";
import { memoryStats } from "../internal/api";

/* eslint-env jest */

describe("stringsMemoryReuse.test", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("setting a shorter string, and then as original size again", () => {
    const objectBuffer = createObjectBuffer(externalArgs, 256, {
      str: "abc"
    });

    const memoryAfterEachOperation: number[] = [memoryStats(objectBuffer).used];

    objectBuffer.str = "ab";
    expect(objectBuffer).toMatchInlineSnapshot(`
          Object {
            "str": "ab",
          }
      `);
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.str = "123";

    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        96,
        96,
        96,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "str": "123",
      }
    `);
  });

  test("minimumStringAllocation", () => {
    const objectBuffer = createObjectBuffer(
      { ...externalArgs, minimumStringAllocation: 10 },
      256,
      {
        str: "123"
      }
    );

    const memoryAfterEachOperation: number[] = [memoryStats(objectBuffer).used];

    objectBuffer.str = "1234567890";
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "str": "1234567890",
      }
    `);
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.str = "123";
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.str = "1234567890".repeat(2);
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        104,
        104,
        104,
        128,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "str": "12345678901234567890",
      }
    `);
  });
});
