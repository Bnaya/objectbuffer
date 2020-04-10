/* eslint-env jest */

import { MemPool } from "@thi.ng/malloc";
import { createObjectBuffer, memoryStats } from "./api";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { getInternalAPI, externalArgsApiToExternalArgsApi } from "./utils";

describe("getAllLinkedAddresses", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  describe("Make sure all allocated are discovered", () => {
    test("Small object", () => {
      const allocatedAddresses: number[] = [];
      const origMalloc = MemPool.prototype.malloc;
      MemPool.prototype.malloc = function malloc(dataSize: number) {
        const address = origMalloc.call(this, dataSize);

        allocatedAddresses.push(address);

        return address;
      };

      const objectBuffer = createObjectBuffer(externalArgs, 2048, {
        smallObject: [{ a: "6" }],
      });
      // const a = objectBuffer.nestedObject;
      // getInternalAPI(a).destroy();
      // // a.toString();

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier,
        false,
        // allocatedAddresses[allocatedAddresses.length - 1]
        entryPointer
      );

      expect([...linkedAddresses.leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );
    });

    test("With Map & Set", () => {
      const allocatedAddresses: number[] = [];
      const origMalloc = MemPool.prototype.malloc;
      MemPool.prototype.malloc = function malloc(dataSize: number) {
        const address = origMalloc.call(this, dataSize);

        allocatedAddresses.push(address);

        return address;
      };

      const objectBuffer = createObjectBuffer(externalArgs, 2048, {
        m: new Map([
          ["a", 1],
          ["b", 2],
        ]),
        s: new Set(["a", "b", "c"]),
      });

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier,
        false,
        entryPointer
      );

      expect([...linkedAddresses.leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );
    });

    test("object with more stuff", () => {
      const allocatedAddresses: number[] = [];
      const origMalloc = MemPool.prototype.malloc;
      MemPool.prototype.malloc = function malloc(dataSize: number) {
        const address = origMalloc.call(this, dataSize);

        allocatedAddresses.push(address);

        return address;
      };

      const objectBuffer = createObjectBuffer(externalArgs, 2048, {
        nestedObject: { a: 1, b: null, c: "string", bigint: BigInt("100") },
        arr: [new Date(0), "somestring", { a: "6", h: null }],
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

      expect([...linkedAddresses.leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );

      expect([...linkedAddresses.leafAddresses].slice().sort())
        .toMatchInlineSnapshot(`
        Array [
          1008,
          1032,
          1056,
          1072,
          1096,
          112,
          1120,
          1144,
          1160,
          1184,
          1216,
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
          360,
          376,
          400,
          424,
          448,
          464,
          48,
          488,
          512,
          528,
          560,
          584,
          616,
          632,
          656,
          680,
          704,
          72,
          728,
          744,
          848,
          880,
          912,
          936,
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
        arr: [new Date(0), "somestring", { a: "6", h: null }],
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
Object {
  "available": 816,
  "used": 1232,
}
`);

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier,
        false,
        allocatedAddresses[allocatedAddresses.length - 1]
      );

      linkedAddresses.leafAddresses.forEach((address) => {
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
