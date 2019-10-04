/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { getFirstFreeByte } from "./testUtils";

describe("pop it all", () => {
  const textEncoder = new utils.TextEncoder();
  const textDecoder = new utils.TextDecoder();
  test("lets 1", () => {
    const arrayBuffer = new ArrayBuffer(1024);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = ["a", "b", 1];

    const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

    const arrayWrapper: any = createArrayWrapper(
      dataView,
      0,
      saverOutput.start,
      textDecoder,
      textEncoder
    );

    for (let i = 0; i < 10; i++) {
      arrayWrapper.push(i);
    }

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        "a",
        "b",
        1,
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

    do {
      arrayWrapper.pop();
    } while (arrayWrapper.length !== 0);

    expect(arrayWrapper).toMatchInlineSnapshot(`Array []`);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`703`);
  });
});
