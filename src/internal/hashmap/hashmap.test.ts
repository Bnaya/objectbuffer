/* eslint-env jest */
import * as util from "util";
import { arrayBuffer2HexArray, recordAllocations } from "../testUtils";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import { MEM_POOL_START } from "../consts";
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
import { DataViewAndAllocatorCarrier, StringEntry } from "../interfaces";
import { readEntry } from "../store";
import { externalArgsApiToExternalArgsApi } from "../utils";

describe("hashmap", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  let ab = new ArrayBuffer(128);
  let dataView = new DataView(ab);
  let allocator = new MemPool({
    buf: ab
  });
  let carrier: DataViewAndAllocatorCarrier = {
    dataView,
    allocator
  };

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    dataView = new DataView(ab);
    allocator = new MemPool({
      buf: ab,
      start: MEM_POOL_START
    });
    carrier = {
      dataView,
      allocator
    };
  }

  beforeEach(() => {
    setABSize(256);
  });

  test("createHashMap", () => {
    const mapPointer = createHashMap(carrier, 8);
    expect(mapPointer).toMatchInlineSnapshot(`40`);
    expect(arrayBuffer2HexArray(ab.slice(0, 128), true)).toMatchSnapshot(
      "simple create empty"
    );
  });

  test("hashMapInsert simple, key is number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const valuePointer = hashMapInsertUpdate(
      externalArgs,
      { dataView, allocator },
      mapPointer,
      3
    );

    dataView.setUint32(valuePointer, 5);

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot("after insert");
  });

  test("hashMapInsert simple, key is string", () => {
    const mapPointer = createHashMap(carrier, 8);

    const pointer = hashMapInsertUpdate(
      externalArgs,
      { dataView, allocator },
      mapPointer,
      "abc"
    );

    dataView.setUint32(pointer, 6);

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot("after insert");
  });

  test("hashMapInsert / hashMapValueLookup simple, key is a number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = 3;

    const pointer = hashMapInsertUpdate(
      externalArgs,
      { dataView, allocator },
      mapPointer,
      key
    );

    const foundValuePointer = hashMapValueLookup(
      externalArgs,
      dataView,
      mapPointer,
      key
    );

    expect(pointer).toBe(foundValuePointer);
  });

  test("hashMapInsert / hashMapValueLookup simple, key is a string", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = "abc";

    const valuePointer = hashMapInsertUpdate(
      externalArgs,
      { dataView, allocator },
      mapPointer,
      key
    );

    const foundValuePointer = hashMapValueLookup(
      externalArgs,
      dataView,
      mapPointer,
      key
    );
    expect(foundValuePointer).toBe(valuePointer);
  });

  test("hashMapInsert / hashMapValueLookup, same key give same pointer", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = "abc";

    const firstValuePointer = hashMapInsertUpdate(
      externalArgs,
      { dataView, allocator },
      mapPointer,
      key
    );

    expect(firstValuePointer).toMatchInlineSnapshot(`136`);

    const foundValuePointer = hashMapValueLookup(
      externalArgs,
      dataView,
      mapPointer,
      key
    );

    expect(foundValuePointer).toBe(firstValuePointer);
  });

  test("hashMapValueLookup none existing key", () => {
    const mapPointer = createHashMap(carrier);

    const key = "abc";

    const memoryOfOverWrittenValue = hashMapInsertUpdate(
      externalArgs,
      { dataView, allocator },
      mapPointer,
      key
    );

    expect(memoryOfOverWrittenValue).toMatchInlineSnapshot(`144`);

    const foundValuePointer = hashMapValueLookup(
      externalArgs,
      dataView,
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
        hashMapInsertUpdate(
          externalArgs,
          { dataView, allocator },
          mapPointer,
          value
        )
      );
      dataView.setUint32(inserts[inserts.length - 1], index);
    }

    const values: Array<{
      valuePointer: number;
      keyPointer: number;
    }> = [];

    let iteratorToken = 0;
    while (
      (iteratorToken = hashMapLowLevelIterator(
        dataView,
        mapPointer,
        iteratorToken
      )) !== 0
    ) {
      values.push(hashMapNodePointerToKeyValue(dataView, iteratorToken));
    }
    expect(
      values.map(
        v =>
          (readEntry(externalArgs, dataView, v.keyPointer) as StringEntry).value
      )
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

    expect(hashMapSize(dataView, mapPointer)).toMatchInlineSnapshot(`0`);
    const memAvailableAfterEachStep = [allocator.stats().available];

    const input = [...new Array(26).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map(n => String.fromCharCode(n));

    for (const [index, useThatAsKey] of input.entries()) {
      dataView.setUint32(
        hashMapInsertUpdate(
          externalArgs,
          { dataView, allocator },
          mapPointer,
          useThatAsKey
        ),
        index
      );

      memAvailableAfterEachStep.push(allocator.stats().available);
    }

    expect(hashMapSize(dataView, mapPointer)).toMatchInlineSnapshot(`26`);

    hashMapDelete(externalArgs, carrier, mapPointer, "a");
    hashMapDelete(externalArgs, carrier, mapPointer, "b");
    hashMapDelete(externalArgs, carrier, mapPointer, "c");
    expect(hashMapSize(dataView, mapPointer)).toMatchInlineSnapshot(`23`);
    memAvailableAfterEachStep.push(allocator.stats().available);

    expect(memAvailableAfterEachStep).toMatchInlineSnapshot(`
      Array [
        1912,
        1856,
        1800,
        1744,
        1688,
        1632,
        1576,
        1520,
        1424,
        1360,
        1304,
        1248,
        1192,
        1136,
        1080,
        1024,
        888,
        832,
        768,
        712,
        656,
        600,
        544,
        488,
        432,
        376,
        320,
        488,
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
      hashmapPointer = createHashMap({ dataView, allocator });

      expect(allocator.stats().available).toMatchInlineSnapshot(`888`);

      let toAdd: undefined | string;

      while ((toAdd = inputCopy.pop()) !== undefined) {
        dataView.setUint32(
          hashMapInsertUpdate(
            externalArgs,
            { dataView, allocator },
            hashmapPointer,
            toAdd
          ),
          toAdd.charCodeAt(0)
        );
      }
    }, allocator);

    const r = hashMapGetPointersToFree(dataView, hashmapPointer);

    expect(r).toMatchInlineSnapshot(`
      Object {
        "pointers": Array [
          40,
          592,
          112,
          128,
          184,
          240,
          296,
          352,
          408,
          464,
          520,
          576,
          680,
          736,
          144,
          168,
          200,
          224,
          256,
          280,
          312,
          336,
          368,
          392,
          424,
          448,
          480,
          504,
          536,
          560,
          64,
          88,
          696,
          720,
        ],
        "pointersToValuePointers": Array [
          144,
          200,
          256,
          312,
          368,
          424,
          480,
          536,
          64,
          696,
        ],
      }
    `);

    expect(r.pointers.sort()).toEqual(allocations.sort());
    expect(
      r.pointersToValuePointers
        .map(v => String.fromCharCode(dataView.getUint32(v)))
        .sort()
    ).toEqual(input.sort());
  });
});
