/* eslint-env jest */

import * as util from "util";
import { MemPool } from "@thi.ng/malloc";
import { createObjectBuffer, memoryStats } from "./api";
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

      // const a = objectBuffer.nestedObject;
      // getInternalAPI(a).destroy();
      // // a.toString();

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier,
        false,
        allocatedAddresses[allocatedAddresses.length - 1]
      );

      expect(linkedAddresses.leafAddresses.slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );

      expect(linkedAddresses.leafAddresses.slice().sort())
        .toMatchInlineSnapshot(`
        Array [
          1008,
          1032,
          1048,
          1064,
          1080,
          1104,
          112,
          128,
          144,
          168,
          200,
          216,
          240,
          280,
          296,
          312,
          336,
          352,
          368,
          392,
          416,
          432,
          448,
          472,
          48,
          488,
          504,
          528,
          552,
          576,
          592,
          616,
          632,
          656,
          672,
          688,
          72,
          792,
          816,
          840,
          864,
          904,
          920,
          936,
          960,
          976,
          992,
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
          "available": 936,
          "used": 1112,
        }
      `);

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier,
        false,
        allocatedAddresses[allocatedAddresses.length - 1]
      );

      linkedAddresses.leafAddresses.forEach(address => {
        pool.free(address);
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 2008,
          "used": 40,
        }
      `);
    });
  });
});
