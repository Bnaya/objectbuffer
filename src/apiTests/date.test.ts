/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

describe("Date test", () => {
  test("Date object test", () => {
    const objectBuffer = createObjectBuffer(1024, {
      // 1/1 2000
      myDate: new Date(946684800000),
    });

    const usedBefore = memoryStats(objectBuffer).used;

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "myDate": "2000-01-01T00:00:00.000Z",
      }
    `);

    objectBuffer.myDate.setDate(10);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "myDate": "2000-01-10T00:00:00.000Z",
      }
    `);

    objectBuffer.myDate.setMonth(3);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "myDate": "2000-04-10T00:00:00.000Z",
      }
    `);

    expect(objectBuffer.myDate.toISOString()).toMatchInlineSnapshot(
      `"2000-04-10T00:00:00.000Z"`
    );

    expect(memoryStats(objectBuffer).used).toBe(usedBefore);
  });
});
