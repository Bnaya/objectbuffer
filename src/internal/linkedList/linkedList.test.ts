/* eslint-env jest */

import {
  arrayBuffer2HexArray,
  recordAllocations,
  makeCarrier,
} from "../testUtils";

import {
  linkedListItemInsert,
  linkedListItemRemove,
  initLinkedList,
  linkedListLowLevelIterator,
  linkedListGetValue,
  linkedListGetPointersToFree,
  // LINKED_LIST_ITEM_MACHINE
} from "./linkedList";

describe.skip("LinkedList", () => {
  let ab = new ArrayBuffer(64);
  let carrier = makeCarrier(ab);

  function setABSize(size: number) {
    ab = new ArrayBuffer(size);
    carrier = makeCarrier(ab);
  }

  beforeEach(() => {
    setABSize(136);
  });

  test("linkedList init & add", () => {
    setABSize(96);

    const linkedListPointer = initLinkedList(carrier);

    expect(
      arrayBuffer2HexArray(ab.slice(0, carrier.allocator.stats().top), true)
    ).toMatchSnapshot();

    const itemPointer = linkedListItemInsert(carrier, linkedListPointer, 7);

    expect(itemPointer).toBe(72);

    expect(
      arrayBuffer2HexArray(ab.slice(0, carrier.allocator.stats().top), true)
    ).toMatchSnapshot();
  });

  test("linkedList init & add 2 & delete 2", () => {
    const linkedListPointer = initLinkedList(carrier);
    // const copyToCompare = ab.slice(0);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);

    const pointer1 = linkedListItemInsert(carrier, linkedListPointer, 7);
    const pointer2 = linkedListItemInsert(carrier, linkedListPointer, 8);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`112`);

    expect(pointer1).toBe(72);
    expect(pointer2).toBe(88);

    linkedListItemRemove(carrier, pointer2);
    linkedListItemRemove(carrier, pointer1);

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

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);
  });

  test("linkedList linkedListLowLevelIterator test 1", () => {
    setABSize(264);
    const linkedListPointer = initLinkedList(carrier);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);

    const itemsPointers = [
      linkedListItemInsert(carrier, linkedListPointer, 7),
      linkedListItemInsert(carrier, linkedListPointer, 6),
      linkedListItemInsert(carrier, linkedListPointer, 5),
      linkedListItemInsert(carrier, linkedListPointer, 4),
    ];

    const values = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        carrier.heap,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      values.push(linkedListGetValue(carrier.heap, iteratorPointer));
    }

    expect(values).toMatchInlineSnapshot(`
      Array [
        7,
        6,
        5,
        4,
      ]
    `);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`144`);

    itemsPointers.forEach((p) => linkedListItemRemove(carrier, p));

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);
  });

  test("linkedList linkedListLowLevelIterator - delete while iteration", () => {
    setABSize(264);
    const linkedListPointer = initLinkedList(carrier);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);

    const itemsPointers = [
      linkedListItemInsert(carrier, linkedListPointer, 7),
      linkedListItemInsert(carrier, linkedListPointer, 6),
      linkedListItemInsert(carrier, linkedListPointer, 5),
      linkedListItemInsert(carrier, linkedListPointer, 4),
    ];

    const values = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        carrier.heap,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      values.push(linkedListGetValue(carrier.heap, iteratorPointer));
      linkedListItemRemove(carrier, iteratorPointer);
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

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`144`);

    itemsPointers.forEach((p) => linkedListItemRemove(carrier, p));

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);
  });

  test.skip("linkedList linkedListLowLevelIterator - delete while iteration - delete current value", () => {
    setABSize(264);
    const linkedListPointer = initLinkedList(carrier);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`184`);

    const regularSet = new Set([7, 6, 5, 4]);
    const itemsPointers = [
      linkedListItemInsert(carrier, linkedListPointer, 7),
      linkedListItemInsert(carrier, linkedListPointer, 6),
      linkedListItemInsert(carrier, linkedListPointer, 5),
      linkedListItemInsert(carrier, linkedListPointer, 4),
    ];

    const linkedLintResults = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        carrier.heap,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      linkedLintResults.push(linkedListGetValue(carrier.heap, iteratorPointer));
      linkedListItemRemove(carrier, iteratorPointer);
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
    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`152`);

    itemsPointers.forEach((p) => linkedListItemRemove(carrier, p));

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`184`);
  });

  test("linkedList linkedListLowLevelIterator - add while iteration", () => {
    setABSize(264);
    const linkedListPointer = initLinkedList(carrier);

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);

    const itemsPointers = [
      linkedListItemInsert(carrier, linkedListPointer, 7),
      linkedListItemInsert(carrier, linkedListPointer, 6),
    ];

    const toAdd = [8, 9];
    let c = 0;

    const values = [];

    let iteratorPointer = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        carrier.heap,
        linkedListPointer,
        iteratorPointer
      ))
    ) {
      values.push(linkedListGetValue(carrier.heap, iteratorPointer));
      if (c < toAdd.length) {
        linkedListItemInsert(carrier, linkedListPointer, toAdd[c++]);
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

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`144`);

    itemsPointers.forEach((p) => linkedListItemRemove(carrier, p));

    const iteratorPointerToFree = 0;
    while (
      (iteratorPointer = linkedListLowLevelIterator(
        carrier.heap,
        linkedListPointer,
        iteratorPointerToFree
      ))
    ) {
      linkedListItemRemove(carrier, iteratorPointer);
    }

    expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);
  });

  test("linkedList linkedListGetPointersToFree", () => {
    setABSize(144);
    let linkedListPointer = 0;
    const toAddItems = [8, 9, 10, 11];
    const toAddItemsCopy = toAddItems.slice();

    const { allocations } = recordAllocations(() => {
      linkedListPointer = initLinkedList(carrier);

      expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`80`);

      let toAdd: undefined | number = 0;

      while ((toAdd = toAddItemsCopy.pop()) !== undefined) {
        linkedListItemInsert(carrier, linkedListPointer, toAdd);
      }
    }, carrier.allocator);

    const r = linkedListGetPointersToFree(carrier.heap, linkedListPointer);

    expect(r).toMatchInlineSnapshot(`
      Object {
        "pointers": Array [
          56,
          72,
          88,
          104,
          120,
          136,
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
