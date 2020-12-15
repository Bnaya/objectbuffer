/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("Runtime errors", () => {
  test("Fail to create when not enough memory", () => {
    expect(() => {
      createObjectBuffer(64, { value: "1".repeat(512) });
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);
  });

  test("Fail to set new data when enough memory", () => {
    const objectBuffer = createObjectBuffer<any>(400, {
      value: "first value 123",
    });
    const freeSpaceLeft = memoryStats(objectBuffer).available;

    expect(() => {
      objectBuffer.anotherValue = "1".repeat(512);
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toEqual(freeSpaceLeft);
    expect(freeSpaceLeft).toMatchInlineSnapshot(`0`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "value": "first value 123",
      }
    `);
  });
});
