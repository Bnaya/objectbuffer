/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs, resizeObjectBuffer } from "../";
import { getUnderlyingArrayBuffer } from "../internal/api";

describe("replaceArrayBufferFlow", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("test resizeObjectBuffer works", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      obj1: { a: 1 }
    });

    const oldAb = getUnderlyingArrayBuffer(objectBuffer);
    expect(oldAb.byteLength).toMatchInlineSnapshot(`1024`);

    const obj1Proxy = objectBuffer.obj1;

    expect(obj1Proxy).toBe(objectBuffer.obj1);

    const newAb = resizeObjectBuffer(objectBuffer, 512);

    expect(newAb.byteLength).toMatchInlineSnapshot(`512`);
    expect(newAb).not.toBe(oldAb);

    expect(obj1Proxy).toBe(objectBuffer.obj1);

    objectBuffer.obj1.a = 2;
    objectBuffer.obj1.b = "new value";

    expect(obj1Proxy).toMatchInlineSnapshot(`
      Object {
        "a": 2,
        "b": "new value",
      }
    `);
  });
});
