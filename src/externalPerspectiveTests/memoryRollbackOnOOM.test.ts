/* eslint-env jest */

import { createObjectBuffer } from "..";
import { memoryStats } from "../internal/api";

describe("memory OOM transactions", () => {
  test("Object set (covers also Map & Set)", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {
      foo: null,
    });

    const initialSpaceTaken = memoryStats(objectBuffer).used;

    expect(initialSpaceTaken).toBe(328);

    expect(() => {
      objectBuffer.foo = {
        big: "object",
        more: "than size",
        arr: [1, 2, 3],
      };
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).used).toBe(initialSpaceTaken);

    expect(objectBuffer).toMatchInlineSnapshot(`
      {
        "foo": null,
      }
    `);

    objectBuffer.bar = [1, "a"];

    expect(objectBuffer).toMatchInlineSnapshot(`
      {
        "bar": [
          1,
          "a",
        ],
        "foo": null,
      }
    `);
  });

  test("Array set", () => {
    const objectBuffer = createObjectBuffer<any>(512, {
      arr: [1],
    });

    const initialFreeSpace = memoryStats(objectBuffer).available;

    expect(initialFreeSpace).toBe(88);

    expect(() => {
      objectBuffer.arr[1] = "a".repeat(512);
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toBe(initialFreeSpace);

    expect(objectBuffer).toMatchInlineSnapshot(`
      {
        "arr": [
          1,
        ],
      }
    `);

    objectBuffer.arr[0] = 2;
    expect(objectBuffer).toMatchInlineSnapshot(`
      {
        "arr": [
          2,
        ],
      }
    `);
  });

  test("Array splice", () => {
    const objectBuffer = createObjectBuffer<any>(512, {
      arr: [1],
    });

    // const memoryStatsBefore = getInternalAPI(objectBuffer)
    //   .getCarrier()
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   .allocator._allocatedBlocks();

    const initialFreeSpace = memoryStats(objectBuffer).available;

    expect(initialFreeSpace).toBe(88);

    expect(() => {
      objectBuffer.arr.splice(0, 0, "a", "b", "c", "d", "e", "f", "g");
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    // expect(memoryStatsBefore).toEqual(
    //   getInternalAPI(objectBuffer)
    //     .getCarrier()
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     .allocator._allocatedBlocks()
    // );

    expect(memoryStats(objectBuffer).available).toBe(initialFreeSpace);

    expect(objectBuffer).toMatchInlineSnapshot(`
      {
        "arr": [
          1,
        ],
      }
    `);

    objectBuffer.arr.splice(0, 0, "a");
    expect(objectBuffer).toMatchInlineSnapshot(`
      {
        "arr": [
          "a",
          1,
        ],
      }
    `);
  });
});
