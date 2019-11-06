/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer, ExternalArgs, resizeObjectBuffer } from "../";
import {
  getUnderlyingArrayBuffer,
  replaceUnderlyingArrayBuffer,
  memoryStats
} from "../internal/api";
import { arrayBufferCopyTo } from "../internal/utils";

describe("replaceArrayBufferFlow", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("test replaceUnderlyingArrayBuffer works", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 512, {
      a: 1
    });

    const oldAb = getUnderlyingArrayBuffer(objectBuffer);

    const newAb = new ArrayBuffer(1024);
    arrayBufferCopyTo(oldAb, 0, oldAb.byteLength, newAb, 0);

    // destroy oldAb values
    const destroyer = new Uint8Array(oldAb);
    destroyer.set(destroyer.map(() => 0));

    replaceUnderlyingArrayBuffer(objectBuffer, newAb);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`928`);
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "a": 1,
      }
    `);
  });

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
