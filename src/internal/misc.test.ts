/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("pop it all", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  test("lets 1", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START
    });

    const arrayToSave = ["a", "b", -100];
    const arrayToCompare = arrayToSave.slice();

    const saverOutput = arraySaver(
      externalArgs,
      { dataView, allocator },
      [],
      arrayToSave
    );

    const arrayWrapper = createArrayWrapper(
      externalArgs,
      { dataView, allocator },
      saverOutput
    );

    const sizeAfterEachPush: number[] = [];

    for (let i = 0; i < 10; i += 1) {
      arrayWrapper.push(i);
      arrayToCompare.push(i);
      sizeAfterEachPush.push(allocator.stats().available);
    }

    expect(sizeAfterEachPush).toMatchInlineSnapshot(`
      Array [
        272,
        248,
        224,
        200,
        176,
        152,
        128,
        104,
        80,
        56,
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
    expect(allocator.stats().available).toMatchInlineSnapshot(`56`);
  });
});
