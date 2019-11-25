/* eslint-env jest */

import { arrayBuffer2HexArray, recordAllocations } from "../testUtils";
import { MemPool } from "@thi.ng/malloc";
import { MEM_POOL_START } from "../consts";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// import jestDiff from "jest-diff";

import {
  linkedListItemInsert,
  linkedListItemRemove,
  initLinkedList,
  linkedListLowLevelIterator,
  linkedListGetValue,
  linkedListGetPointersToFree
  // LINKED_LIST_ITEM_MACHINE
} from "./linkedList";

describe("LinkedList", () => {
  let ab = new ArrayBuffer(64);
  let dataView = new DataView(ab);
  let allocator = new MemPool({
    buf: ab
  });

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    dataView = new DataView(ab);
    allocator = new MemPool({
      buf: ab,
      start: MEM_POOL_START
    });
  }

  beforeEach(() => {
    setABSize(128);
  });

  test("linkedList init & add", () => {
    setABSize(80);

    const linkedListPointer = initLinkedList({ dataView, allocator });

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot();

    const itemPointer = linkedListItemInsert(
      { dataView, allocator },
      linkedListPointer,
      7
    );

    expect(itemPointer).toBe(64);

    expect(arrayBuffer2HexArray(ab, true)).toMatchSnapshot();
  });

  test("linkedList init & add 2 & delete 2", () => {
    const linkedListPointer = initLinkedList({ dataView, allocator });
    // const copyToCompare = ab.slice(0);

    expect(allocator.stats().available).toMatchInlineSnapshot(`56`);

    const pointer1 = linkedListItemInsert(
      { dataView, allocator },
      linkedListPointer,
      7
    );
    const pointer2 = linkedListItemInsert(
      { dataView, allocator },
      linkedListPointer,
      8
    );

    expect(allocator.stats().available).toMatchInlineSnapshot(`24`);

    expect(pointer1).toBe(64);
    expect(pointer2).toBe(80);

    linkedListItemRemove({ dataView, allocator }, pointer2);
    linkedListItemRemove({ dataView, allocator }, pointer1);

    // fails on github action ??
    // expect(
    //   jestDiff(
    //     arrayBuffer2HexArray(copyToCompare, true),
    //     arrayBuffer2HexArray(ab, true),
    //     { contextLines: 0, expand: false }
    //   )
    // ).toMatchInlineSnapshot(`
    //   "[32m- Expected[39m
    //   [31m+ Received[39m

    //   [33m@@ -45,1 +45,1 @@[39m
    //   [32m-   \\"43:0x38\\",[39m
    //   [31m+   \\"43:0x58\\",[39m
    //   [33m@@ -66,1 +66,1 @@[39m
    //   [32m-   \\"64:0x00\\",[39m
    //   [31m+   \\"64:0x10\\",[39m
    //   [33m@@ -82,1 +82,1 @@[39m
    //   [32m-   \\"80:0x00\\",[39m
    //   [31m+   \\"80:0x10\\",[39m"
    // `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`56`);
  });

  test("linkedList linkedListLowLevelIterator test 1", () => {
    setABSize(256);
    const linkedListPointer = initLinkedList({ dataView, allocator });

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);

    const itemsPointers = [
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 7),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 6),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 5),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 4)
    ];

    const values = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        dataView,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      values.push(linkedListGetValue(dataView, iteratorPointer));
    }

    expect(values).toMatchInlineSnapshot(`
      Array [
        7,
        6,
        5,
        4,
      ]
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`120`);

    itemsPointers.forEach(p =>
      linkedListItemRemove({ dataView, allocator }, p)
    );

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);
  });

  test("linkedList linkedListLowLevelIterator - delete while iteration", () => {
    setABSize(256);
    const linkedListPointer = initLinkedList({ dataView, allocator });

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);

    const itemsPointers = [
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 7),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 6),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 5),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 4)
    ];

    const values = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        dataView,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      values.push(linkedListGetValue(dataView, iteratorPointer));
      linkedListItemRemove({ dataView, allocator }, iteratorPointer);
    }

    const regularSetResults: number[] = [];
    const regularSet = new Set([7, 6, 5, 4]);
    for (const v of regularSet) {
      regularSetResults.push(v);
      regularSet.delete(v - 1);
    }

    expect(regularSetResults).toEqual(values);
    expect(values).toMatchInlineSnapshot(`
      Array [
        7,
        5,
      ]
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`152`);

    itemsPointers.forEach(p =>
      linkedListItemRemove({ dataView, allocator }, p)
    );

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);
  });

  test.skip("linkedList linkedListLowLevelIterator - delete while iteration - delete current value", () => {
    setABSize(256);
    const linkedListPointer = initLinkedList({ dataView, allocator });

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);

    const regularSet = new Set([7, 6, 5, 4]);
    const itemsPointers = [
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 7),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 6),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 5),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 4)
    ];

    const linkedLintResults = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        dataView,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      linkedLintResults.push(linkedListGetValue(dataView, iteratorPointer));
      linkedListItemRemove({ dataView, allocator }, iteratorPointer);
    }

    const regularSetResults: number[] = [];
    for (const v of regularSet) {
      regularSetResults.push(v);
      regularSet.delete(v);
    }

    expect(regularSetResults).toMatchInlineSnapshot(`
      Array [
        7,
        6,
        5,
        4,
      ]
    `);
    expect(linkedLintResults).toMatchInlineSnapshot(`
      Array [
        7,
        5,
      ]
    `);

    expect(regularSetResults).toEqual(linkedLintResults);
    expect(allocator.stats().available).toMatchInlineSnapshot(`152`);

    itemsPointers.forEach(p =>
      linkedListItemRemove({ dataView, allocator }, p)
    );

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);
  });

  test("linkedList linkedListLowLevelIterator - add while iteration", () => {
    setABSize(256);
    const linkedListPointer = initLinkedList({ dataView, allocator });

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);

    const itemsPointers = [
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 7),
      linkedListItemInsert({ dataView, allocator }, linkedListPointer, 6)
    ];

    const toAdd = [8, 9];
    let c = 0;

    const values = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        dataView,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      values.push(linkedListGetValue(dataView, iteratorPointer));
      if (c < toAdd.length) {
        linkedListItemInsert(
          { dataView, allocator },
          linkedListPointer,
          toAdd[c++]
        );
      }
    }

    c = 0;

    const regularSetResults: number[] = [];
    const regularSet = new Set([7, 6]);
    for (const v of regularSet) {
      regularSetResults.push(v);
      if (c < toAdd.length) {
        regularSet.add(toAdd[c++]);
      }
    }

    expect(regularSetResults).toEqual(values);
    expect(values).toMatchInlineSnapshot(`
      Array [
        7,
        6,
        8,
        9,
      ]
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`120`);

    itemsPointers.forEach(p =>
      linkedListItemRemove({ dataView, allocator }, p)
    );

    const iteratorPointerToFree = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        dataView,
        linkedListPointer,
        iteratorPointerToFree
      ))
    ) {
      linkedListItemRemove({ dataView, allocator }, iteratorPointer);
    }

    expect(allocator.stats().available).toMatchInlineSnapshot(`184`);
  });

  test("linkedList linkedListGetPointersToFree", () => {
    setABSize(136);
    let linkedListPointer = 0;
    const toAddItems = [8, 9, 10, 11];
    const toAddItemsCopy = toAddItems.slice();

    const { allocations } = recordAllocations(() => {
      linkedListPointer = initLinkedList({ dataView, allocator });

      expect(allocator.stats().available).toMatchInlineSnapshot(`64`);

      let toAdd: undefined | number = 0;

      while ((toAdd = toAddItemsCopy.pop()) !== undefined) {
        linkedListItemInsert({ dataView, allocator }, linkedListPointer, toAdd);
      }
    }, allocator);

    const r = linkedListGetPointersToFree(dataView, linkedListPointer);

    expect(r).toMatchInlineSnapshot(`
      Object {
        "pointers": Array [
          48,
          64,
          80,
          96,
          112,
          128,
        ],
        "valuePointers": Array [
          11,
          10,
          9,
          8,
        ],
      }
    `);

    expect(r.pointers.sort()).toEqual(allocations.sort());
    expect(r.valuePointers.sort()).toEqual(toAddItems.sort());
  });
});
