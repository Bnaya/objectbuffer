/* eslint-env jest */

import { createObjectBuffer, unstable_resizeObjectBuffer } from "../";
import {
  getUnderlyingArrayBuffer,
  unstable_replaceUnderlyingArrayBuffer,
  memoryStats,
} from "../internal/api";
import { arrayBufferCopyTo } from "../internal/utils";

describe("replaceArrayBufferFlow", () => {
  test("test unstable_replaceUnderlyingArrayBuffer works", () => {
    const objectBuffer = createObjectBuffer<any>(512, {
      a: 1,
    });

    const oldAb = getUnderlyingArrayBuffer(objectBuffer);

    const newAb = new ArrayBuffer(1024);
    arrayBufferCopyTo(oldAb, 0, oldAb.byteLength, newAb, 0);

    // destroy oldAb values
    const destroyer = new Uint8Array(oldAb);
    destroyer.set(destroyer.map(() => 0));

    unstable_replaceUnderlyingArrayBuffer(objectBuffer, newAb);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`664`);
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "a": 1,
      }
    `);
  });

  test("test unstable_resizeObjectBuffer works", () => {
    const objectBuffer = createObjectBuffer<any>(4096, {
      obj1: { a: 1 },
    });

    const oldAb = getUnderlyingArrayBuffer(objectBuffer);
    expect(oldAb.byteLength).toMatchInlineSnapshot(`4096`);

    const obj1Proxy = objectBuffer.obj1;

    expect(obj1Proxy).toBe(objectBuffer.obj1);

    const newAb = unstable_resizeObjectBuffer(objectBuffer, 2048);

    expect(newAb.byteLength).toMatchInlineSnapshot(`2048`);
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
