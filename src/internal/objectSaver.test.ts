/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { objectSaver } from "./objectSaver";
import { ExternalArgs } from "./interfaces";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import { MEM_POOL_START } from "./consts";

describe("objectSaver tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("objectSaver - general", () => {
    test("objectSaver", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

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

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      expect(saverOutput).toMatchInlineSnapshot(`384`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
      expect(allocator.stats().available).toMatchInlineSnapshot(`120`);
    });
  });
});
