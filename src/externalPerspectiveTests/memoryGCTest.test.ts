/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-env jest, node */
import { createObjectBuffer } from "..";
import { memoryStats, processQueuedReclaims } from "../internal/api";
import { sleep } from "../internal/testUtils";
import { getInternalAPI } from "../internal/utils";
import { getAddressesNoLongerUsedArrayForCarrier } from "../internal/stateModule";
// @ts-expect-error package have no types
import runGc from "expose-gc/function";

// declare const FinalizationGroup: any;
// declare const WeakRef: any;

describe("memory GC related tests", () => {
  if (
    typeof FinalizationRegistry === "undefined" &&
    // @ts-expect-error
    typeof FinalizationGroup === "undefined"
  ) {
    throw new Error("must --harmony-weak-refs or node 14");
  }

  test("Test FinalizationRegistry kicks in", async function () {
    const objectBuffer: any = createObjectBuffer(1024, {
      foo: { a: "123abc" },
    });

    const carrier = getInternalAPI(objectBuffer).getCarrier();

    let foo = objectBuffer.foo;

    objectBuffer.foo = undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    foo = undefined;

    runGc();

    await sleep(1000);

    runGc();

    await sleep(1000);

    const addressesNoLongerUsed = getAddressesNoLongerUsedArrayForCarrier(
      carrier
    );

    expect(addressesNoLongerUsed).toMatchInlineSnapshot(`
      Array [
        344,
      ]
    `);
  }, 10000);

  test("Test collectGarbage works", async function () {
    const objectBuffer: any = createObjectBuffer(1024, {
      foo: undefined,
    });

    const initialMemoryStats = memoryStats(objectBuffer);

    objectBuffer.foo = { a: "1234567890" };

    const secondMemoryStats = memoryStats(objectBuffer);

    expect(
      initialMemoryStats.available - secondMemoryStats.available
    ).toMatchInlineSnapshot(`352`);

    let foo = objectBuffer.foo;

    objectBuffer.foo = undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    foo = undefined;

    runGc();

    await sleep(100);

    runGc();

    await sleep(100);

    processQueuedReclaims(objectBuffer);
    const finalMemoryStats = memoryStats(objectBuffer);

    expect(finalMemoryStats.available).toBe(initialMemoryStats.available);
  }, 10000);
});
