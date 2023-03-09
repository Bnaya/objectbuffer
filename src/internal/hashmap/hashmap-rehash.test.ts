/* eslint-env jest */

import { makeCarrier } from "../testUtils";
import {
  createHashMap,
  hashMapInsertUpdate,
  hashMapLowLevelIterator,
  hashMapSize,
  hashMapDelete,
  hashMapValueLookup,
  hashMapNodePointerToKey,
  hashMapNodePointerToValue,
  hashMapCapacity,
} from "./hashmap";
import { GlobalCarrier } from "../interfaces";
import { externalArgsApiToExternalArgsApi } from "../utils";
import { readString } from "../readString";

describe("hashmap rehash", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  let carrier: GlobalCarrier = makeCarrier(128);

  function setABSize(size: number) {
    carrier = makeCarrier(size);
  }

  beforeEach(() => {
    setABSize(256);
  });

  test("lookup after rehash", () => {
    const abSize = 1024;
    setABSize(abSize);
    const mapPointer = createHashMap(carrier, 1);
    expect(hashMapCapacity(carrier.heap, mapPointer)).toBe(1);

    expect(hashMapSize(carrier.heap, mapPointer)).toBe(0);

    const aPtr = hashMapInsertUpdate(externalArgs, carrier, mapPointer, "a");
    expect(hashMapValueLookup(carrier.heap, mapPointer, "a")).toBe(aPtr);

    expect(hashMapCapacity(carrier.heap, mapPointer)).toBe(2);

    const bPtr = hashMapInsertUpdate(externalArgs, carrier, mapPointer, "b");
    expect(hashMapValueLookup(carrier.heap, mapPointer, "b")).toBe(bPtr);

    expect(hashMapCapacity(carrier.heap, mapPointer)).toBe(4);

    const ptr1 = hashMapInsertUpdate(externalArgs, carrier, mapPointer, 1);
    expect(hashMapValueLookup(carrier.heap, mapPointer, 1)).toBe(ptr1);

    expect(hashMapCapacity(carrier.heap, mapPointer)).toBe(4);

    const ptr2 = hashMapInsertUpdate(externalArgs, carrier, mapPointer, 2);
    expect(hashMapValueLookup(carrier.heap, mapPointer, 2)).toBe(ptr2);

    expect(hashMapCapacity(carrier.heap, mapPointer)).toBe(8);

    const ptr3 = hashMapInsertUpdate(externalArgs, carrier, mapPointer, 3);
    expect(hashMapValueLookup(carrier.heap, mapPointer, 3)).toBe(ptr3);
    const ptr4 = hashMapInsertUpdate(externalArgs, carrier, mapPointer, 4);
    expect(hashMapValueLookup(carrier.heap, mapPointer, 4)).toBe(ptr4);
    const ptr5 = hashMapInsertUpdate(externalArgs, carrier, mapPointer, 5);
    expect(hashMapValueLookup(carrier.heap, mapPointer, 5)).toBe(ptr5);
    const ptr6 = hashMapInsertUpdate(externalArgs, carrier, mapPointer, 6);
    expect(hashMapValueLookup(carrier.heap, mapPointer, 6)).toBe(ptr6);

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

      carrier.heap.u32[
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
      values.push({
        valuePointer: hashMapNodePointerToValue(iteratorToken),
        keyPointer: hashMapNodePointerToKey(carrier.heap, iteratorToken),
      });
    }
    expect(values.map((v) => readString(carrier.heap, v.keyPointer)))
      .toMatchInlineSnapshot(`
      [
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
      carrier.heap.u32[ptrsToPtrs[ptrsToPtrs.length - 1]] = index;

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
      [
        152,
        272,
        424,
        520,
        688,
        776,
        896,
        896,
      ]
    `);
  });
});
