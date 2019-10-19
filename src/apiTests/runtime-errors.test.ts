/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs } from "../";
import { spaceLeft } from "../internal/api";

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
      `"Offset is outside the bounds of the DataView"`
    );
  });

  test("Fail to set new data when enough memory", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 128, {
      value: "first value"
    });
    const freeSpaceLeft = spaceLeft(objectBuffer);

    expect(() => {
      objectBuffer.anotherValue = "1".repeat(512);
    }).toThrowErrorMatchingInlineSnapshot(`"OutOfMemoryError"`);

    expect(spaceLeft(objectBuffer)).toEqual(freeSpaceLeft);
    expect(freeSpaceLeft).toMatchInlineSnapshot(`56`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "value": "first value",
      }
    `);
  });
});
