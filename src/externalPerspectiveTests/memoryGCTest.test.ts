/* eslint-disable */
import { ExternalArgs } from "../internal/interfaces";

import { createObjectBuffer } from "..";
import { memoryStats } from "../internal/api";
import { wait } from "../internal/testUtils";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

/* eslint-env jest, node */

// declare const FinalizationGroup: any;
// declare const WeakRef: any;

describe.skip("memoryGCTest.test", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (typeof gc === "undefined") {
    throw new Error("must --expose-gc");
  }

  // @ts-ignore
  if (typeof FinalizationGroup === "undefined") {
    throw new Error("must --harmony-weak-refs");
  }

  const externalArgs = externalArgsApiToExternalArgsApi({


    arrayAdditionalAllocation: 0,

  });

  test("internal ArrayBuffer GC", async () => {
    // @ts-ignore
    gc();

    const { external: initialExternal } = process.memoryUsage();

    let objectBuffer: any = createObjectBuffer(externalArgs, 1000, {
      foo: { a: "123abc" }
    });

    let foo = objectBuffer.foo;

    // @ts-ignore
    gc();

    expect(
      process.memoryUsage().external - initialExternal
    ).toMatchInlineSnapshot(`1025`);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`856`);

    // disposeWrapperObject(foo);
    objectBuffer.foo = undefined;
    foo = undefined;

    // foo = undefined;

    // @ts-ignore
    gc();

    await wait(4000);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`912`);

    // debugger;

    expect(
      process.memoryUsage().external - initialExternal
    ).toMatchInlineSnapshot(`35782`);
  });

  test("FinalizationGroup internal reference count", () => {});
});
