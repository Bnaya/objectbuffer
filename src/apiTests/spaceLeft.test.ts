/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs, spaceLeft } from "../";
import { resizeObjectBuffer } from "../internal/api";

describe("spaceLeft test", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("spaceLeft test", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 }
    });

    expect(spaceLeft(objectBuffer)).toMatchInlineSnapshot(`876`);
  });

  test("spaceLeft after resize", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      arr: [1, 2, 3, 4],
      obj: { a: 1 }
    });

    resizeObjectBuffer(objectBuffer, 256);
    expect(spaceLeft(objectBuffer)).toMatchInlineSnapshot(`108`);

    resizeObjectBuffer(objectBuffer, 512);
    expect(spaceLeft(objectBuffer)).toMatchInlineSnapshot(`364`);
  });
});
