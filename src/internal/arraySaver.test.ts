/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { arraySaver } from "./arraySaver";
import { ExternalArgs } from "./interfaces";

describe("arraySaver tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("arraySaver - general", () => {
    test("arraySaver", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2, 3];

      const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

      expect(saverOutput).toMatchInlineSnapshot(`
        Object {
          "length": 52,
          "start": 63,
        }
      `);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
    });
  });
});
