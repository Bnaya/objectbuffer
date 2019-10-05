/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs } from "../";
import { getFirstFreeByte } from "../internal/testUtils";
import { getUnderlyingArrayBuffer } from "../internal/api";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("SharedArrayBuffer tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { arr: [1, 2, 3, 4] },
      { useSharedArrayBuffer: false }
    );

    objectBuffer.arr.unshift("a");

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          "a",
          1,
          2,
          3,
          4,
        ],
      }
    `);

    expect(
      getFirstFreeByte(getUnderlyingArrayBuffer(objectBuffer))
    ).toMatchInlineSnapshot(`132`);
  });
});
