/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray, makeCarrier } from "./testUtils";
import { arraySaver } from "./arraySaver";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("arraySaver tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  describe("arraySaver - general", () => {
    test("arraySaver", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2, 3];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      expect(saverOutput).toMatchInlineSnapshot(`224`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot(
        "after array save"
      );
    });
  });
});
