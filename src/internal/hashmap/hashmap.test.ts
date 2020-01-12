/* eslint-env jest */
import * as util from "util";
import {
  arrayBuffer2HexArray,
  recordAllocations,
  makeCarrier
} from "../testUtils";
import {
  createHashMap,
  hashMapInsertUpdate,
  hashMapValueLookup,
  hashMapLowLevelIterator,
  hashMapNodePointerToKeyValue,
  hashMapSize,
  hashMapDelete,
  hashMapGetPointersToFree
} from "./hashmap";
import { GlobalCarrier, StringEntry } from "../interfaces";
import { readEntry } from "../store";
import { externalArgsApiToExternalArgsApi } from "../utils";

describe("hashmap", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  let ab = new ArrayBuffer(128);
  let carrier: GlobalCarrier = makeCarrier(ab);

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    carrier = makeCarrier(ab);
  }

  beforeEach(() => {
    setABSize(256);
  });

  test("createHashMap", () => {
    const mapPointer = createHashMap(carrier, 8);
    expect(mapPointer).toMatchInlineSnapshot(`48`);
    expect(arrayBuffer2HexArray(ab.slice(0, 128), true)).toMatchSnapshot(
      "simple create empty"
    );
  });

  test("hashMapInsert simple, key is number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const valuePointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      3
    );

    carrier.dataView.setUint32(valuePointer, 5);

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot("after insert");
  });

  test("hashMapInsert simple, key is string", () => {
    const mapPointer = createHashMap(carrier, 8);

    const pointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      "abc"
    );

    carrier.dataView.setUint32(pointer, 6);

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot("after insert");
  });

  test("hashMapInsert / hashMapValueLookup simple, key is a number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = 3;

    const pointer = hashMapInsertUpdate(externalArgs, carrier, mapPointer, key);

    const foundValuePointer = hashMapValueLookup(carrier, mapPointer, key);

    expect(pointer).toBe(foundValuePointer);
  });

  test("hashMapInsert / hashMapValueLookup simple, key is a string", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = "abc";

    const valuePointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      key
    );

    const foundValuePointer = hashMapValueLookup(carrier, mapPointer, key);
    expect(foundValuePointer).toBe(valuePointer);
  });

  test("hashMapInsert / hashMapValueLookup, same key give same pointer", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = "abc";

    const firstValuePointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      key
    );

    expect(firstValuePointer).toMatchInlineSnapshot(`144`);

    const foundValuePointer = hashMapValueLookup(carrier, mapPointer, key);

    expect(foundValuePointer).toBe(firstValuePointer);
  });

  test("hashMapValueLookup none existing key", () => {
    const mapPointer = createHashMap(carrier);

    const key = "abc";

    const memoryOfOverWrittenValue = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      key
    );

    expect(memoryOfOverWrittenValue).toMatchInlineSnapshot(`152`);

    const foundValuePointer = hashMapValueLookup(
      carrier,
      mapPointer,
      "Not a real key"
    );
    expect(foundValuePointer).toBe(0);
  });

  test("hashMapLowLevelIterator", () => {
    setABSize(2048);
    const mapPointer = createHashMap(carrier);

    const input = [...new Array(26).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map(n => String.fromCharCode(n));

    const inserts: number[] = [];

    for (const [index, value] of input.entries()) {
      inserts.push(
        hashMapInsertUpdate(externalArgs, carrier, mapPointer, value)
      );
      carrier.dataView.setUint32(inserts[inserts.length - 1], index);
    }

    const values: Array<{
      valuePointer: number;
      keyPointer: number;
    }> = [];

    let iteratorToken = 0;
    while (
      (iteratorToken = hashMapLowLevelIterator(
        carrier.dataView,
        mapPointer,
        iteratorToken
      )) !== 0
    ) {
      values.push(
        hashMapNodePointerToKeyValue(carrier.dataView, iteratorToken)
      );
    }
    expect(
      values.map(v => (readEntry(carrier, v.keyPointer) as StringEntry).value)
    ).toMatchInlineSnapshot(`
      Array [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ]
    `);
  });

  test("hashMapSize", () => {
    setABSize(2048);
    const mapPointer = createHashMap(carrier);

    expect(hashMapSize(carrier.dataView, mapPointer)).toMatchInlineSnapshot(
      `0`
    );
    const memAvailableAfterEachStep = [carrier.allocator.stats().available];

    const input = [...new Array(26).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map(n => String.fromCharCode(n));

    for (const [index, useThatAsKey] of input.entries()) {
      carrier.dataView.setUint32(
        hashMapInsertUpdate(externalArgs, carrier, mapPointer, useThatAsKey),
        index
      );

      memAvailableAfterEachStep.push(carrier.allocator.stats().available);
    }

    expect(hashMapSize(carrier.dataView, mapPointer)).toMatchInlineSnapshot(
      `26`
    );

    hashMapDelete(carrier, mapPointer, "a");
    hashMapDelete(carrier, mapPointer, "b");
    hashMapDelete(carrier, mapPointer, "c");
    expect(hashMapSize(carrier.dataView, mapPointer)).toMatchInlineSnapshot(
      `23`
    );
    memAvailableAfterEachStep.push(carrier.allocator.stats().available);

    expect(memAvailableAfterEachStep).toMatchInlineSnapshot(`
      Array [
        1904,
        1848,
        1792,
        1736,
        1680,
        1624,
        1568,
        1512,
        1416,
        1352,
        1296,
        1240,
        1184,
        1128,
        1072,
        1016,
        880,
        824,
        760,
        704,
        648,
        592,
        536,
        480,
        424,
        368,
        312,
        480,
      ]
    `);
  });

  test("hashMapGetPointersToFree", () => {
    setABSize(1024);
    let hashmapPointer = 0;

    // a + 10 letters
    const input = [...new Array(10).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map(n => String.fromCharCode(n));
    const inputCopy = input.slice();

    const { allocations } = recordAllocations(() => {
      hashmapPointer = createHashMap(carrier);

      expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`880`);

      let toAdd: undefined | string;

      while ((toAdd = inputCopy.pop()) !== undefined) {
        carrier.dataView.setUint32(
          hashMapInsertUpdate(externalArgs, carrier, hashmapPointer, toAdd),
          toAdd.charCodeAt(0)
        );
      }
    }, carrier.allocator);

    const r = hashMapGetPointersToFree(carrier.dataView, hashmapPointer);

    expect(r).toMatchInlineSnapshot(`
      Object {
        "pointers": Array [
          48,
          600,
          120,
          136,
          192,
          248,
          304,
          360,
          416,
          472,
          528,
          584,
          688,
          744,
          152,
          176,
          208,
          232,
          264,
          288,
          320,
          344,
          376,
          400,
          432,
          456,
          488,
          512,
          544,
          568,
          72,
          96,
          704,
          728,
        ],
        "pointersToValuePointers": Array [
          152,
          208,
          264,
          320,
          376,
          432,
          488,
          544,
          72,
          704,
        ],
      }
    `);

    expect(r.pointers.sort()).toEqual(allocations.sort());
    expect(
      r.pointersToValuePointers
        .map(v => String.fromCharCode(carrier.dataView.getUint32(v)))
        .sort()
    ).toEqual(input.sort());
  });
});
