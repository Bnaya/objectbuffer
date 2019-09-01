/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { objectSaver } from "./objectSaver";

describe("objectSaver tests", () => {
  describe("objectSaver - general", () => {
    test("objectSaver", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const textEncoder = new utils.TextEncoder();
      // const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        6: null,
        ab: undefined,
        abc: BigInt("100"),
        nestedObject: {
          nestedProp: 7
        }
      };

      const saverOutput = objectSaver(textEncoder, dataView, objectToSave);

      expect(saverOutput).toMatchInlineSnapshot(`
        Object {
          "length": 159,
          "start": 170,
        }
      `);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
    });
  });
});
