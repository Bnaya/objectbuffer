/* eslint-env jest */

import * as util from "util";
import { ExternalArgs } from "./interfaces";
import { sizeOf } from "./sizeOf";

describe("sizeOf tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20,
    minimumStringAllocation: 0
  };

  test("number", () => {
    expect(sizeOf(externalArgs, 5)).toMatchInlineSnapshot(`9`);
  });

  test("string", () => {
    expect(sizeOf(externalArgs, "סלאם עליכום")).toMatchInlineSnapshot(`47`);
  });

  test("undefined", () => {
    expect(sizeOf(externalArgs, undefined)).toMatchInlineSnapshot(`1`);
  });

  test("null", () => {
    expect(sizeOf(externalArgs, null)).toMatchInlineSnapshot(`1`);
  });

  test("Array", () => {
    expect(
      sizeOf(externalArgs, ["a", { a: "u" }, null, undefined, 1])
    ).toMatchInlineSnapshot(`148`);
  });

  test("Object", () => {
    expect(
      sizeOf(externalArgs, { a: 1, b: "some string" })
    ).toMatchInlineSnapshot(`65`);
  });
});
