import { createObjectBuffer } from "..";
import { memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

/* eslint-env jest */

describe("memoryRollbackOnOOM.test", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 0,
  });

  test("memoryRollbackOnOOM", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 256, {
      foo: null,
    });

    const initialFreeSpace = memoryStats(objectBuffer).available;

    expect(initialFreeSpace).toMatchInlineSnapshot(`32`);

    expect(() => {
      objectBuffer.foo = {
        big: "object",
        more: "than size",
        arr: [1, 2, 3],
      };
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`32`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "foo": null,
      }
    `);
  });
});
