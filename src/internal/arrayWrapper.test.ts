/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { MemPool } from "@thi.ng/malloc";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { makeCarrier } from "./testUtils";

describe("arrayWrapper tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20,
  });

  describe("arrayWrapper - general", () => {
    test("arrayWrapper class 1", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        externalArgs,
        carrier,
        saverOutput
      );

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`264`);
    });

    test("arrayWrapper array.keys()", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });
      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const arrayWrapper = createArrayWrapper(
        externalArgs,
        carrier,
        saverOutput
      );

      expect([...arrayWrapper.keys()]).toEqual([0, 1, 2]);

      expect(allocator.stats().available).toMatchInlineSnapshot(`264`);
    });

    test("arrayWrapper array.entries()", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });
      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const arrayWrapper = createArrayWrapper(
        externalArgs,
        carrier,
        saverOutput
      );

      expect([...arrayWrapper.entries()]).toMatchInlineSnapshot(`
        Array [
          Array [
            0,
            "a",
          ],
          Array [
            1,
            "b",
          ],
          Array [
            2,
            1,
          ],
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`264`);
    });

    test("arrayWrapper array.values() & iterator", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });
      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const arrayWrapper = createArrayWrapper(
        externalArgs,
        carrier,
        saverOutput
      );

      expect([...arrayWrapper.values()]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);
      expect([...arrayWrapper]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`264`);
    });

    test("arrayWrapper set value in bound", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        externalArgs,
        carrier,
        saverOutput
      );

      arrayWrapper[1] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "new value",
          1,
        ]
      `);
    });

    test("arrayWrapper set value out of bound, but inside allocated space", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(
        { ...externalArgs, arrayAdditionalAllocation: 15 },
        carrier,
        [],
        arrayToSave
      );

      const arrayWrapper: any = createArrayWrapper(
        { ...externalArgs, arrayAdditionalAllocation: 15 },
        carrier,
        saverOutput
      );

      arrayWrapper[10] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "new value",
        ]
      `);
    });

    test("arrayWrapper set value out of bound, but outside allocated space", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });
      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        { ...externalArgs, arrayAdditionalAllocation: 3 },
        carrier,
        saverOutput
      );

      arrayWrapper[10] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "new value",
        ]
      `);
      expect(allocator.stats().available).toMatchInlineSnapshot(`232`);
    });
  });

  test("arrayWrapper sort - no comparator", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const carrier = makeCarrier(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START,
    });

    const arrayToSave = [2, 1, null, 3, 10, undefined, 6, 77];

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      carrier,
      saverOutput
    );

    arrayWrapper.sort();

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        10,
        2,
        3,
        6,
        77,
        null,
        undefined,
      ]
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`176`);
  });

  test("arrayWrapper sort - with comparator", () => {
    const arrayBuffer = new ArrayBuffer(2048);
    const carrier = makeCarrier(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START,
    });

    const arrayToSave = [2, 1, 3, 10, 6, 77].map((value) => ({
      value,
    }));

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      carrier,
      saverOutput
    );

    arrayWrapper.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      } else if (b.value > a.value) {
        return -1;
      } else {
        return 0;
      }
    });

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        Object {
          "value": 1,
        },
        Object {
          "value": 2,
        },
        Object {
          "value": 3,
        },
        Object {
          "value": 6,
        },
        Object {
          "value": 10,
        },
        Object {
          "value": 77,
        },
      ]
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`568`);
  });

  test("arrayWrapper - reverse", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const carrier = makeCarrier(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START,
    });

    const arrayToSave = [1, 2, 3, 4, 5, 6, 7];

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      carrier,
      saverOutput
    );

    arrayWrapper.reverse();
    arrayWrapper.reverse();
    const r = arrayWrapper.reverse();

    expect(r).toBe(arrayWrapper);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
      ]
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`152`);
  });

  test("arrayWrapper - set length", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const carrier = makeCarrier(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START,
    });

    const arrayToSave = [1, 2, 3, 4, 5, 6, 7];

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      carrier,
      saverOutput
    );

    arrayWrapper.length = 10;
    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        undefined,
        undefined,
        undefined,
      ]
    `);

    arrayWrapper.length = 1;
    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
      ]
    `);

    expect(() => {
      arrayWrapper.length = -1;
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid array length"`);

    expect(() => {
      arrayWrapper.length = ("a" as unknown) as number;
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid array length"`);

    expect(() => {
      arrayWrapper.length = 2.2;
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid array length"`);

    expect(allocator.stats().available).toMatchInlineSnapshot(`152`);
  });
});
