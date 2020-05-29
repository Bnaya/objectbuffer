/* eslint-env jest */

import {
  arrayBuffer2HexArray,
  recordAllocations,
  makeCarrier,
} from "../testUtils";
import {
  createHashMap,
  hashMapInsertUpdate,
  hashMapValueLookup,
  hashMapLowLevelIterator,
  hashMapNodePointerToKeyValue,
  hashMapSize,
  hashMapDelete,
  hashMapGetPointersToFree,
} from "./hashmap";
import { GlobalCarrier } from "../interfaces";
import { externalArgsApiToExternalArgsApi } from "../utils";
import { readString } from "../readString";

describe("hashmap", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  let ab = new ArrayBuffer(128 * 4);
  let carrier: GlobalCarrier = makeCarrier(ab);

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    carrier = makeCarrier(ab);
  }

  beforeEach(() => {
    setABSize(256 * 4);
  });

  test.skip("createHashMap", () => {
    const mapPointer = createHashMap(carrier, 8);
    expect(mapPointer).toMatchInlineSnapshot(`48`);
    expect(arrayBuffer2HexArray(ab.slice(0, 128), true)).toMatchSnapshot(
      "simple create empty"
    );
  });

  test.skip("hashMapInsert simple, key is number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const valuePointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      3
    );

    carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT] = 5;

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot("after insert");
  });

  test.skip("hashMapInsert simple, key is string", () => {
    const mapPointer = createHashMap(carrier, 8);

    const pointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      "abc"
    );

    carrier.heap.Uint32Array[pointer / Uint32Array.BYTES_PER_ELEMENT] = 6;

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot("after insert");
  });

  test("hashMapInsert / hashMapValueLookup simple, key is a number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const key = 3;

    const pointer = hashMapInsertUpdate(externalArgs, carrier, mapPointer, key);

    const foundValuePointer = hashMapValueLookup(carrier.heap, mapPointer, key);

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

    const foundValuePointer = hashMapValueLookup(carrier.heap, mapPointer, key);
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

    const foundValuePointer = hashMapValueLookup(carrier.heap, mapPointer, key);

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
      carrier.heap,
      mapPointer,
      "Not a real key"
    );
    expect(foundValuePointer).toBe(0);
  });

  test("hashMapLowLevelIterator", () => {
    setABSize(2048 * 2);
    const mapPointer = createHashMap(carrier);

    const input = [...new Array(26).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map((n) => String.fromCharCode(n));

    const inserts: number[] = [];

    for (const [index, value] of input.entries()) {
      inserts.push(
        hashMapInsertUpdate(externalArgs, carrier, mapPointer, value)
      );

      carrier.heap.Uint32Array[
        inserts[inserts.length - 1] / Uint32Array.BYTES_PER_ELEMENT
      ] = index;
    }

    const values: Array<{
      valuePointer: number;
      keyPointer: number;
    }> = [];

    let iteratorToken = 0;
    while (
      (iteratorToken = hashMapLowLevelIterator(
        carrier.heap,
        mapPointer,
        iteratorToken
      )) !== 0
    ) {
      values.push(hashMapNodePointerToKeyValue(carrier.heap, iteratorToken));
    }
    expect(values.map((v) => readString(carrier.heap, v.keyPointer)))
      .toMatchInlineSnapshot(`
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
    const abSize = 2048 * 4;
    setABSize(abSize);
    const mapPointer = createHashMap(carrier);

    expect(hashMapSize(carrier.heap, mapPointer)).toMatchInlineSnapshot(`0`);
    const memAvailableAfterEachStep = [carrier.allocator.stats().available];

    const input = [...new Array(26).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map((n) => String.fromCharCode(n));

    for (const [index, useThatAsKey] of input.entries()) {
      carrier.heap.Uint32Array[
        hashMapInsertUpdate(externalArgs, carrier, mapPointer, useThatAsKey) /
          Uint32Array.BYTES_PER_ELEMENT
      ] = index;

      memAvailableAfterEachStep.push(carrier.allocator.stats().available);
    }

    expect(hashMapSize(carrier.heap, mapPointer)).toMatchInlineSnapshot(`26`);

    hashMapDelete(carrier, mapPointer, "a");
    hashMapDelete(carrier, mapPointer, "b");
    hashMapDelete(carrier, mapPointer, "c");
    expect(hashMapSize(carrier.heap, mapPointer)).toMatchInlineSnapshot(`26`);
    memAvailableAfterEachStep.push(carrier.allocator.stats().available);

    expect(memAvailableAfterEachStep.map((a) => abSize - a))
      .toMatchInlineSnapshot(`
      Array [
        144,
        224,
        304,
        384,
        464,
        544,
        624,
        704,
        824,
        904,
        984,
        1064,
        1144,
        1224,
        1304,
        1384,
        1464,
        1544,
        1624,
        1704,
        1784,
        1864,
        2024,
        2112,
        2192,
        2272,
        2352,
        2352,
      ]
    `);
  });

  test("hashMapGetPointersToFree", () => {
    setABSize(1024 * 4);
    let hashmapPointer = 0;

    // a + 10 letters
    const input = [...new Array(10).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map((n) => String.fromCharCode(n));
    const inputCopy = input.slice();

    const { allocations } = recordAllocations(() => {
      hashmapPointer = createHashMap(carrier);

      // expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`880`);

      let toAdd: undefined | string;

      while ((toAdd = inputCopy.pop()) !== undefined) {
        carrier.heap.Uint32Array[
          hashMapInsertUpdate(externalArgs, carrier, hashmapPointer, toAdd) /
            Uint32Array.BYTES_PER_ELEMENT
        ] = toAdd.charCodeAt(0);
      }
    }, carrier.allocator);

    const r = hashMapGetPointersToFree(carrier.heap, hashmapPointer);

    expect(r.pointers.sort()).toEqual(allocations.sort());
    expect(
      r.pointersToValuePointers
        .map((v) =>
          String.fromCharCode(
            carrier.heap.Uint32Array[v / Uint32Array.BYTES_PER_ELEMENT]
          )
        )
        .sort()
    ).toEqual(input.sort());
  });
});
