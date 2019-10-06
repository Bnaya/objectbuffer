/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray, getFirstFreeByte } from "./testUtils";
import { objectSaver } from "./objectSaver";
import { ExternalArgs } from "./interfaces";

describe("objectSaver tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("objectSaver - general", () => {
    test("objectSaver", () => {
      const arrayBuffer = new ArrayBuffer(256);
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

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      expect(saverOutput).toMatchInlineSnapshot(`
        Object {
          "length": 171,
          "start": 190,
        }
      `);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`195`);
    });
  });
});
