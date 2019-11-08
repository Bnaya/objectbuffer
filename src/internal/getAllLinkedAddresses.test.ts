/* eslint-env jest */

import * as util from "util";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import {
  createObjectBuffer,
  memoryStats,
  getUnderlyingArrayBuffer
} from "./api";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { getInternalAPI, externalArgsApiToExternalArgsApi } from "./utils";

describe("getAllLinkedAddresses", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  describe("getAllLinkedAddresses no reference counting", () => {
    test("getAllLinkedAddresses", () => {
      const allocatedAddresses: number[] = [];
      const origMalloc = MemPool.prototype.malloc;
      MemPool.prototype.malloc = function malloc(dataSize: number) {
        const address = origMalloc.call(this, dataSize);

        allocatedAddresses.push(address);

        return address;
      };

      const objectBuffer = createObjectBuffer(externalArgs, 2048, {
        nestedObject: { a: 1, b: null, c: "string", bigint: BigInt("100") },
        arr: [new Date(0), "somestring", { a: "6", h: null }]
      });

      const dataView = new DataView(getUnderlyingArrayBuffer(objectBuffer));
      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        externalArgs,
        dataView,
        false,
        allocatedAddresses[allocatedAddresses.length - 1]
      );

      expect(linkedAddresses.slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );

      expect(linkedAddresses.slice().sort()).toMatchInlineSnapshot(`
        Array [
          1000,
          1016,
          104,
          1040,
          1056,
          1072,
          1088,
          1104,
          1128,
          120,
          136,
          160,
          192,
          208,
          232,
          272,
          288,
          304,
          328,
          344,
          360,
          384,
          40,
          408,
          424,
          440,
          456,
          480,
          496,
          512,
          536,
          560,
          584,
          600,
          624,
          64,
          640,
          664,
          680,
          696,
          800,
          824,
          848,
          872,
          912,
          928,
          944,
          968,
          984,
        ]
      `);
    });

    test("getAllLinkedAddresses free all from outside", () => {
      const allocatedAddresses: number[] = [];
      const origMalloc = MemPool.prototype.malloc;
      let pool: MemPool;
      MemPool.prototype.malloc = function malloc(dataSize: number) {
        pool = this;
        const address = origMalloc.call(this, dataSize);

        allocatedAddresses.push(address);

        return address;
      };

      const objectBuffer = createObjectBuffer(externalArgs, 2048, {
        nestedObject: { a: 1, b: null, c: "string", bigint: BigInt("100") },
        arr: [new Date(0), "somestring", { a: "6", h: null }]
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 912,
          "used": 1136,
        }
      `);

      const dataView = new DataView(getUnderlyingArrayBuffer(objectBuffer));

      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        externalArgs,
        dataView,
        false,
        allocatedAddresses[allocatedAddresses.length - 1]
      );

      linkedAddresses.forEach(address => {
        pool.free(address);
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 1832,
          "used": 216,
        }
      `);
    });
  });
});
