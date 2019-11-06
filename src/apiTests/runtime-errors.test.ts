/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs } from "../";
import { memoryStats } from "../internal/api";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("Runtime errors", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("Fail to create when not enough memory", () => {
    expect(() => {
      createObjectBuffer(externalArgs, 8, { value: "" });
    }).toThrowErrorMatchingInlineSnapshot(
      `"Start offset 16 is outside the bounds of the buffer"`
    );
  });

  test("Fail to set new data when enough memory", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 256, {
      value: "first value 123"
    });
    const freeSpaceLeft = memoryStats(objectBuffer).available;

    expect(() => {
      objectBuffer.anotherValue = "1".repeat(512);
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toEqual(freeSpaceLeft);
    expect(freeSpaceLeft).toMatchInlineSnapshot(`136`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "value": "first value 123",
      }
    `);
  });
});
