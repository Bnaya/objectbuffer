/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { arraySaver } from "./arraySaver";
import { ExternalArgs } from "./interfaces";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import { MEM_POOL_START } from "./consts";

describe("arraySaver tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("arraySaver - general", () => {
    test("arraySaver", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const arrayToSave = [1, 2, 3];

      const saverOutput = arraySaver(
        externalArgs,
        { dataView, allocator },
        [],
        arrayToSave
      );

      expect(saverOutput).toMatchInlineSnapshot(`136`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot(
        "after array save"
      );
    });
  });
});
