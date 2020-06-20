/* eslint-env jest */

import { createObjectBuffer } from "..";
import { memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

describe("memory OOM transactions", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 0,
  });

  test("Object set (covers also Map & Set)", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 512, {
      foo: null,
    });

    const initialFreeSpace = memoryStats(objectBuffer).available;

    expect(initialFreeSpace).toBe(256);

    expect(() => {
      objectBuffer.foo = {
        big: "object",
        more: "than size",
        arr: [1, 2, 3],
      };
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toBe(initialFreeSpace);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "foo": null,
      }
    `);

    objectBuffer.bar = [1, "a"];

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "bar": Array [
          1,
          "a",
        ],
        "foo": null,
      }
    `);
  });

  test("Array set", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 512, {
      arr: [1],
    });

    const initialFreeSpace = memoryStats(objectBuffer).available;

    expect(initialFreeSpace).toBe(184);

    expect(() => {
      objectBuffer.arr[1] = "a".repeat(512);
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toBe(initialFreeSpace);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          1,
        ],
      }
    `);

    objectBuffer.arr[0] = 2;
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          2,
        ],
      }
    `);
  });

  test("Array splice", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 512, {
      arr: [1],
    });

    const initialFreeSpace = memoryStats(objectBuffer).available;

    expect(initialFreeSpace).toBe(184);

    expect(() => {
      objectBuffer.arr.splice(0, 0, "a", "b", "c", "d", "e", "f", "g");
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toBe(initialFreeSpace);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          1,
        ],
      }
    `);

    objectBuffer.arr.splice(0, 0, "a");
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          "a",
          1,
        ],
      }
    `);
  });
});
