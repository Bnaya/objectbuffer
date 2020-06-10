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

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier.heap,
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
        s: new Set(["a1", "b2", "c"]),
      });

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier.heap,
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

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier.heap,
        false,
        entryPointer
      );

      expect([...linkedAddresses.leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );
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
          "available": 616,
          "top": 1432,
          "total": 2048,
          "used": 1432,
        }
      `);

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      const carrier = getInternalAPI(objectBuffer).getCarrier();

      getInternalAPI(objectBuffer).destroy();

      const linkedAddresses = getAllLinkedAddresses(
        carrier.heap,
        false,
        entryPointer
      );

      linkedAddresses.leafAddresses.forEach((address) => {
        pool.free(address);
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 2008,
          "top": 40,
          "total": 2048,
          "used": 40,
        }
      `);
    });
  });
});
