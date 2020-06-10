/* eslint-env jest */

import { makeCarrier, makeAllocatorThrowOnOOM } from "../testUtils";
import {
  createHashMap,
  hashMapInsertUpdate,
  hashMapLowLevelIterator,
  hashMapNodePointerToKeyValue,
  hashMapSize,
  hashMapDelete,
  hashMapValueLookup,
} from "./hashmap";
import { GlobalCarrier } from "../interfaces";
import { externalArgsApiToExternalArgsApi } from "../utils";
import { readString } from "../readString";

describe("hashmap rehash", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  let ab = new ArrayBuffer(128);
  let carrier: GlobalCarrier = makeCarrier(ab);
  makeAllocatorThrowOnOOM(carrier.allocator);

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    carrier = makeCarrier(ab);
    makeAllocatorThrowOnOOM(carrier.allocator);
  }

  beforeEach(() => {
    setABSize(256);
  });

  test("lookup after rehash", () => {
    const abSize = 1024;
    setABSize(abSize);
    const mapPointer = createHashMap(carrier, 1);
    makeAllocatorThrowOnOOM(carrier.allocator);

    expect(hashMapSize(carrier.heap, mapPointer)).toBe(0);

    const aPtr = hashMapInsertUpdate(externalArgs, carrier, mapPointer, "a");
    expect(hashMapValueLookup(carrier.heap, mapPointer, "a")).toBe(aPtr);

    const bPtr = hashMapInsertUpdate(externalArgs, carrier, mapPointer, "b");
    expect(hashMapValueLookup(carrier.heap, mapPointer, "b")).toBe(bPtr);

    expect(hashMapValueLookup(carrier.heap, mapPointer, "a")).toBe(aPtr);
  });

  test("hashMapLowLevelIterator with rehash", () => {
    setABSize(1024);
    const mapPointer = createHashMap(carrier, 1);

    const input = [...new Array(6).keys()]
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
      ]
    `);
  });

  test("hashMapSize after delete with rehash", () => {
    const abSize = 1024;
    setABSize(abSize);
    const mapPointer = createHashMap(carrier, 1);
    makeAllocatorThrowOnOOM(carrier.allocator);

    expect(hashMapSize(carrier.heap, mapPointer)).toMatchInlineSnapshot(`0`);
    const memAvailableAfterEachStep = [carrier.allocator.stats().top];

    const input = [...new Array(6).keys()]
      .map((i): number => i + "a".charCodeAt(0))
      .map((n) => String.fromCharCode(n));

    const ptrsToPtrs: number[] = [];

    for (const [index, useThatAsKey] of input.entries()) {
      ptrsToPtrs.push(
        hashMapInsertUpdate(externalArgs, carrier, mapPointer, useThatAsKey)
      );
      carrier.heap.Uint32Array[ptrsToPtrs[ptrsToPtrs.length - 1]] = index;

      memAvailableAfterEachStep.push(carrier.allocator.stats().top);
    }

    expect(hashMapSize(carrier.heap, mapPointer)).toBe(6);

    expect(hashMapValueLookup(carrier.heap, mapPointer, "b")).toBe(
      ptrsToPtrs[1]
    );

    expect(hashMapDelete(carrier, mapPointer, "b")).toBe(ptrsToPtrs[1]);
    expect(hashMapDelete(carrier, mapPointer, "c")).toBe(ptrsToPtrs[2]);
    expect(hashMapDelete(carrier, mapPointer, "d")).toBe(ptrsToPtrs[3]);
    expect(hashMapSize(carrier.heap, mapPointer)).toBe(3);
    memAvailableAfterEachStep.push(carrier.allocator.stats().top);

    expect(memAvailableAfterEachStep).toMatchInlineSnapshot(`
      Array [
        112,
        200,
        312,
        384,
        512,
        576,
        664,
        664,
      ]
    `);
  });
});
