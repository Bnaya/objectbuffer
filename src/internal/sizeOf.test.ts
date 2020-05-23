/* eslint-env jest */

import { sizeOf } from "./sizeOf";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { createObjectBuffer, memoryStats } from "..";

describe.skip("sizeOf tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  function doThatForMe(value: any) {
    const o = createObjectBuffer(externalArgs, 1024, { foo: undefined });
    const beforeSave = memoryStats(o).available;

    o.foo = value;

    const afterSave = memoryStats(o).available;

    const calcedSize = sizeOf(externalArgs, value);

    return {
      calcedSize,
      realSize: beforeSave - afterSave,
    };
  }

  test("compare 1", () => {
    const r = doThatForMe("12377777771237777777123777777712377777771237777777");

    expect(r).toMatchInlineSnapshot(`
      Object {
        "calcedSize": 72,
        "realSize": 104,
      }
    `);
    // ???
    expect(r.calcedSize).toBe(r.realSize);
  });

  test("number", () => {
    expect(sizeOf(externalArgs, 5)).toMatchInlineSnapshot(`24`);
  });

  test("string", () => {
    expect(sizeOf(externalArgs, "סלאם עליכום")).toMatchInlineSnapshot(`48`);
  });

  test("undefined", () => {
    expect(sizeOf(externalArgs, undefined)).toMatchInlineSnapshot(`0`);
  });

  test("null", () => {
    expect(sizeOf(externalArgs, null)).toMatchInlineSnapshot(`0`);
  });

  test("Array", () => {
    expect(
      sizeOf(externalArgs, ["a", { a: "u" }, null, undefined, 1])
    ).toMatchInlineSnapshot(`396`);
  });

  test("Object", () => {
    expect(
      sizeOf(externalArgs, { a: 1, b: "some string" })
    ).toMatchInlineSnapshot(`296`);
  });
});
