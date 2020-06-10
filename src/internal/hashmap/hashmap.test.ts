/* eslint-env jest */

import {
  arrayBuffer2HexArray,
  makeCarrier,
  makeAllocatorThrowOnOOM,
} from "../testUtils";
import {
  createHashMap,
  hashMapInsertUpdate,
  hashMapValueLookup,
  hashMapLowLevelIterator,
  hashMapNodePointerToKeyValue,
  hashMapSize,
  hashMapDelete,
} from "./hashmap";
import { GlobalCarrier } from "../interfaces";
import { externalArgsApiToExternalArgsApi } from "../utils";
import { readString } from "../readString";

describe("hashmap", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  let ab = new ArrayBuffer(128);
  let carrier: GlobalCarrier = makeCarrier(ab);

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    carrier = makeCarrier(ab);
    makeAllocatorThrowOnOOM(carrier.allocator);
  }

  beforeEach(() => {
    setABSize(256);
  });

  test("createHashMap", () => {
    const mapPointer = createHashMap(carrier, 8);
    expect(mapPointer).toMatchInlineSnapshot(`48`);
    expect(
      arrayBuffer2HexArray(ab.slice(0, carrier.allocator.stats().top), true)
    ).toMatchSnapshot("simple create empty");
  });

  test("hashMapInsert simple, key is number", () => {
    const mapPointer = createHashMap(carrier, 8);

    const valuePointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      3
    );

    carrier.heap.Uint32Array[valuePointer / Uint32Array.BYTES_PER_ELEMENT] = 5;

    expect(
      arrayBuffer2HexArray(ab.slice(0, carrier.allocator.stats().top), true)
    ).toMatchSnapshot("after insert");
  });

  test("hashMapInsert simple, key is string", () => {
    const mapPointer = createHashMap(carrier, 8);

    const pointer = hashMapInsertUpdate(
      externalArgs,
      carrier,
      mapPointer,
      "abc"
    );

    carrier.heap.Uint32Array[pointer / Uint32Array.BYTES_PER_ELEMENT] = 6;

    expect(
      arrayBuffer2HexArray(ab.slice(0, carrier.allocator.stats().top), true)
    ).toMatchSnapshot("after insert");
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
    const memAvailableAfterEachStep = [carrier.allocator.stats().top];

    const input = [...new Array(26).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map((n) => String.fromCharCode(n));

    for (const [index, useThatAsKey] of input.entries()) {
      carrier.heap.Uint32Array[
        hashMapInsertUpdate(externalArgs, carrier, mapPointer, useThatAsKey) /
          Uint32Array.BYTES_PER_ELEMENT
      ] = index;

      memAvailableAfterEachStep.push(carrier.allocator.stats().top);
    }

    expect(hashMapSize(carrier.heap, mapPointer)).toBe(26);

    hashMapDelete(carrier, mapPointer, "a");
    hashMapDelete(carrier, mapPointer, "b");
    hashMapDelete(carrier, mapPointer, "c");
    hashMapDelete(carrier, mapPointer, "t");
    expect(hashMapSize(carrier.heap, mapPointer)).toBe(22);
    memAvailableAfterEachStep.push(carrier.allocator.stats().top);

    expect(memAvailableAfterEachStep).toMatchInlineSnapshot(`
      Array [
        144,
        232,
        320,
        408,
        496,
        584,
        672,
        760,
        936,
        984,
        1072,
        1160,
        1248,
        1336,
        1424,
        1512,
        1768,
        1768,
        1856,
        1944,
        2032,
        2120,
        2208,
        2296,
        2384,
        2472,
        2560,
        2560,
      ]
    `);
  });
});
