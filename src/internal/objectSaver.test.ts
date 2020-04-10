/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray, makeCarrier } from "./testUtils";
import { objectSaver } from "./objectSaver";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("objectSaver tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
  });

  describe("objectSaver - general", () => {
    test("objectSaver", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);
      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        6: null,
        10: true,
        11: false,
        ab: undefined,
        abc: BigInt("100"),
        nestedObject: {
          nestedProp: 7,
        },
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      expect(saverOutput).toMatchInlineSnapshot(`976`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
      expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`32`);
    });
  });
});
