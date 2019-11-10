/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { objectSaver } from "./objectSaver";
import { MemPool } from "@thi.ng/malloc";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("objectSaver tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder()
  });

  describe("objectSaver - general", () => {
    test("objectSaver", () => {
      const arrayBuffer = new ArrayBuffer(1024);
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

      expect(saverOutput).toMatchInlineSnapshot(`800`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
      expect(allocator.stats().available).toMatchInlineSnapshot(`216`);
    });
  });
});
