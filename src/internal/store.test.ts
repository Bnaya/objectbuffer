/* eslint-env jest */

import { initializeArrayBuffer } from "./store";

import { arrayBuffer2HexArray } from "./testUtils";

describe("Store tests - Misc", () => {
  test("initializeArrayBuffer", () => {
    const arrayBuffer = new ArrayBuffer(64);

    initializeArrayBuffer(arrayBuffer);
    expect(arrayBuffer2HexArray(arrayBuffer.slice(0, 20), true))
      .toMatchInlineSnapshot(`
      Array [
        "0:0x00",
        "1:0x00",
        "2:0x00",
        "3:0x00",
        "4:0x0c",
        "5:0x00",
        "6:0x00",
        "7:0x00",
        "8:0x00",
        "9:0x00",
        "10:0x00",
        "11:0x00",
        "12:0x00",
        "13:0x00",
        "14:0x00",
        "15:0x00",
        "16:0x00",
        "17:0x00",
        "18:0x00",
        "19:0x00",
      ]
    `);
  });
});
