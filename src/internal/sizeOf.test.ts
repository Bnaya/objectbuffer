/* eslint-env jest */

import * as util from "util";
import { ExternalArgs } from "./interfaces";
import { sizeOf } from "./sizeOf";
// import { createObjectBuffer, memoryStats } from "./api";
// import { MEM_POOL_START } from "./consts";

// function saveAndStats(externalArgs: ExternalArgs, value: any) {
//   const o = createObjectBuffer(externalArgs, 1024, value);

//   return {
//     stats: memoryStats(o),
//     size: sizeOf(externalArgs, value) + 47
//   };
// }

describe("sizeOf tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("number", () => {
    expect(sizeOf(externalArgs, 5)).toMatchInlineSnapshot(`17`);
  });

  test("string", () => {
    expect(sizeOf(externalArgs, "סלאם עליכום")).toMatchInlineSnapshot(`55`);
  });

  test("undefined", () => {
    expect(sizeOf(externalArgs, undefined)).toMatchInlineSnapshot(`9`);
  });

  test("null", () => {
    expect(sizeOf(externalArgs, null)).toMatchInlineSnapshot(`9`);
  });

  test("Array", () => {
    expect(
      sizeOf(externalArgs, ["a", { a: "u" }, null, undefined, 1])
    ).toMatchInlineSnapshot(`149`);
  });

  test("Object", () => {
    expect(
      sizeOf(externalArgs, { a: 1, b: "some string" })
    ).toMatchInlineSnapshot(`106`);
  });
});
