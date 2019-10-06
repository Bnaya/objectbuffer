/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { getFirstFreeByte } from "./testUtils";
import { ExternalArgs } from "./interfaces";

describe("pop it all", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20,
    minimumStringAllocation: 0
  };

  test("lets 1", () => {
    const arrayBuffer = new ArrayBuffer(256);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = ["a", "b", -100];
    const arrayToCompare = arrayToSave.slice();

    const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

    const arrayWrapper = createArrayWrapper(
      externalArgs,
      dataView,
      saverOutput.start
    );

    const sizeAfterEachPush: number[] = [];

    for (let i = 0; i < 10; i += 1) {
      arrayWrapper.push(i);
      arrayToCompare.push(i);
      sizeAfterEachPush.push(getFirstFreeByte(arrayBuffer));
    }

    expect(sizeAfterEachPush).toMatchInlineSnapshot(`
      Array [
        161,
        170,
        179,
        188,
        197,
        206,
        215,
        224,
        233,
        242,
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
    expect(arrayWrapper).toEqual(arrayToCompare);
    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`242`);
  });
});
