/* eslint-env jest */

import { createObjectBuffer, memoryStats } from "./api";
import { getAllLinkedAddresses } from "./getAllLinkedAddresses";
import { decrementRefCount } from "./store";
import { TransactionalAllocator } from "./TransactionalAllocator";
import { getInternalAPI, externalArgsApiToExternalArgsApi } from "./utils";

describe("getAllLinkedAddresses", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  describe("Make sure all allocated are discovered", () => {
    test("Small object", () => {
      const allocatedAddresses: number[] = [];

      const wrapAllocationsIn = ["malloc", "calloc", "realloc"] as const;

      for (const funcName of wrapAllocationsIn) {
        const origFunc = TransactionalAllocator.prototype[funcName];
        TransactionalAllocator.prototype[funcName] = function wrappedXlocFunc(
          dataSize: number
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const address = origFunc.call(this, dataSize);

          allocatedAddresses.push(address);

          return address;
        };
      }

      const objectBuffer = createObjectBuffer(
        2048,
        {
          smallObject: [{ a: "6" }],
        },
        externalArgs
      );

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      decrementRefCount(
        getInternalAPI(objectBuffer).getCarrier().heap,
        entryPointer
      );
      getInternalAPI(objectBuffer).destroy();

      const leafAddresses = new Set<number>();
      const arcAddresses = new Map<number, number>();

      getAllLinkedAddresses(
        carrier.heap,
        false,
        // allocatedAddresses[allocatedAddresses.length - 1]
        entryPointer,
        leafAddresses,
        arcAddresses
      );

      expect([...leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );
    });

    test("With Map & Set", () => {
      const allocatedAddresses: number[] = [];

      const wrapAllocationsIn = ["malloc", "calloc", "realloc"] as const;

      for (const funcName of wrapAllocationsIn) {
        const origFunc = TransactionalAllocator.prototype[funcName];
        TransactionalAllocator.prototype[funcName] = function wrappedXlocFunc(
          dataSize: number
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const address = origFunc.call(this, dataSize);

          allocatedAddresses.push(address);

          return address;
        };
      }

      const objectBuffer = createObjectBuffer(
        2048,
        {
          m: new Map([
            ["a", 1],
            ["b", 2],
          ]),
          s: new Set(["a1", "b2", "c"]),
        },
        externalArgs
      );

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      decrementRefCount(
        getInternalAPI(objectBuffer).getCarrier().heap,
        entryPointer
      );
      getInternalAPI(objectBuffer).destroy();

      const leafAddresses = new Set<number>();
      const arcAddresses = new Map<number, number>();

      getAllLinkedAddresses(
        carrier.heap,
        false,
        entryPointer,
        leafAddresses,
        arcAddresses
      );

      expect([...leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );
    });

    test("object with more stuff", () => {
      const allocatedAddresses: number[] = [];

      const wrapAllocationsIn = ["malloc", "calloc", "realloc"] as const;

      for (const funcName of wrapAllocationsIn) {
        const origFunc = TransactionalAllocator.prototype[funcName];
        TransactionalAllocator.prototype[funcName] = function wrappedXlocFunc(
          dataSize: number
        ) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const address = origFunc.call(this, dataSize);

          allocatedAddresses.push(address);

          return address;
        };
      }

      const objectBuffer = createObjectBuffer(
        2048,
        {
          nestedObject: { a: 1, b: null, c: "string", bigint: BigInt("100") },
          arr: [new Date(0), "somestring", { a: "6", h: null }],
        },
        externalArgs
      );

      const carrier = getInternalAPI(objectBuffer).getCarrier();

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      decrementRefCount(
        getInternalAPI(objectBuffer).getCarrier().heap,
        entryPointer
      );
      getInternalAPI(objectBuffer).destroy();

      const leafAddresses = new Set<number>();
      const arcAddresses = new Map<number, number>();

      getAllLinkedAddresses(
        carrier.heap,
        false,
        entryPointer,
        leafAddresses,
        arcAddresses
      );

      expect([...leafAddresses].slice().sort()).toEqual(
        allocatedAddresses.slice().sort()
      );
    });

    test("getAllLinkedAddresses free all from outside", () => {
      const allocatedAddresses: number[] = [];

      const wrapAllocationsIn = ["malloc", "calloc", "realloc"] as const;

      let pool: TransactionalAllocator;
      for (const funcName of wrapAllocationsIn) {
        const origFunc = TransactionalAllocator.prototype[funcName];
        TransactionalAllocator.prototype[funcName] = function wrappedXlocFunc(
          dataSize: number
        ) {
          pool = this;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const address = origFunc.call(this, dataSize);

          allocatedAddresses.push(address);

          return address;
        };
      }

      const objectBuffer = createObjectBuffer(
        2048,
        {
          nestedObject: { a: 1, b: null, c: "string", bigint: BigInt("100") },
          arr: [new Date(0), "somestring", { a: "6", h: null }],
        },
        externalArgs
      );

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 160,
          "top": 1888,
          "total": 2048,
          "used": 1888,
        }
      `);

      const entryPointer = getInternalAPI(objectBuffer).getEntryPointer();
      const carrier = getInternalAPI(objectBuffer).getCarrier();

      decrementRefCount(
        getInternalAPI(objectBuffer).getCarrier().heap,
        entryPointer
      );
      getInternalAPI(objectBuffer).destroy();

      const leafAddresses = new Set<number>();
      const arcAddresses = new Map<number, number>();

      getAllLinkedAddresses(
        carrier.heap,
        false,
        entryPointer,
        leafAddresses,
        arcAddresses
      );

      leafAddresses.forEach((address) => {
        pool.free(address);
      });

      expect(memoryStats(objectBuffer)).toMatchInlineSnapshot(`
        Object {
          "available": 2000,
          "top": 48,
          "total": 2048,
          "used": 48,
        }
      `);
    });
  });
});
