/* eslint-env jest */

import * as util from "util";
import { ExternalArgs } from "./interfaces";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import {
  createObjectBuffer,
  memoryStats,
  getUnderlyingArrayBuffer
} from "./api";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { getInternalAPI } from "./utils";

describe("getAllLinkedAddresses", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("getAllLinkedAddresses no reference counting", () => {
    test("getAllLinkedAddresses", () => {
      const allocatedAddresses: number[] = [];
      const origMalloc = MemPool.prototype.malloc;
      MemPool.prototype.malloc = function malloc(dataSize: number) {
        const address = origMalloc.call(this, dataSize);

        allocatedAddresses.push(address);

        return address;
      };

      const objectBuffer = createObjectBuffer(externalArgs, 1024, {
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
          128,
          144,
          168,
          184,
          208,
          224,
          248,
          272,
          296,
          328,
          360,
          384,
          40,
          400,
          424,
          448,
          472,
          488,
          520,
          64,
          88,
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

      const objectBuffer = createObjectBuffer(externalArgs, 1024, {
        nestedObject: { a: 1, b: null, c: "string", bigint: BigInt("100") },
        arr: [new Date(0), "somestring", { a: "6", h: null }]
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 496,
          "used": 528,
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
          "available": 968,
          "used": 56,
        }
      `);
    });
  });
});
