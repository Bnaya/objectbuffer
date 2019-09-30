/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { arraySaver } from "./arraySaver";

describe("arraySaver tests", () => {
  describe("arraySaver - general", () => {
    test("arraySaver", () => {
      const arrayBuffer = new ArrayBuffer(80);
      const textEncoder = new utils.TextEncoder();
      // const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2, 3];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      expect(saverOutput).toMatchInlineSnapshot(`
        Object {
          "length": 52,
          "start": 55,
        }
      `);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
    });
  });
});
