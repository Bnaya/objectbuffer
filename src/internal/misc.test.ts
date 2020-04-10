/* eslint-env jest */

import { initializeArrayBuffer } from "./store";

import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { makeCarrier } from "./testUtils";

describe("pop it all", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  test("lets 1", () => {
    const arrayBuffer = new ArrayBuffer(512);
    initializeArrayBuffer(arrayBuffer);
    const carrier = makeCarrier(arrayBuffer);

    const arrayToSave = ["a", "b", -100];
    const arrayToCompare = arrayToSave.slice();

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    const arrayWrapper = createArrayWrapper(externalArgs, carrier, saverOutput);

    const sizeAfterEachPush: number[] = [];

    for (let i = 0; i < 10; i += 1) {
      arrayWrapper.push(i);
      arrayToCompare.push(i);
      sizeAfterEachPush.push(carrier.allocator.stats().available);
    }

    expect(sizeAfterEachPush).toMatchInlineSnapshot(`
      Array [
        240,
        216,
        192,
        168,
        144,
        120,
        96,
        72,
        48,
        24,
      ]
    `);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        "a",
        "b",
        -100,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
      ]
    `);

    expect([...arrayWrapper]).toEqual(arrayToCompare);

    do {
      arrayToCompare.pop();
      arrayWrapper.pop();
    } while (arrayWrapper.length !== 0);

    expect(arrayWrapper).toMatchInlineSnapshot(`Array []`);
    expect(arrayToCompare).toEqual(arrayWrapper);
    expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`24`);
  });
});
