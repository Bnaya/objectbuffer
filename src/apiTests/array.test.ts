/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats, disposeWrapperObject } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("SharedArrayBuffer tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 0,
  });

  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(
      externalArgs,
      1024,
      { arr: [1, 2, 3, 4] },
      { useSharedArrayBuffer: false }
    );

    objectBuffer.arr.unshift("a");

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "arr": Array [
          "a",
          1,
          2,
          3,
          4,
        ],
      }
    `);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`544`);
  });

  test("splice 1", () => {
    const ob = createObjectBuffer<{ arr: (number | null)[] }>(
      { arrayAdditionalAllocation: 10 },
      1024,
      { arr: [] },
      { useSharedArrayBuffer: false }
    );

    const usedAfterCreate = memoryStats(ob).used;

    expect(usedAfterCreate).toMatchInlineSnapshot(`328`);

    ob.arr.push(null, null, null, null, null, null, null, null, null, null);
    const usedAfterNullPush = memoryStats(ob).used;
    expect(usedAfterNullPush - usedAfterCreate).toMatchInlineSnapshot(`0`);

    const removedNulls = ob.arr.splice(0, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
    expect(removedNulls).toMatchInlineSnapshot(`
      Array [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]
    `);
    const usedAfterReplaceNullsWithNumbers = memoryStats(ob).used;

    expect(
      usedAfterReplaceNullsWithNumbers - usedAfterCreate
    ).toMatchInlineSnapshot(`240`);

    const removedNumbers = ob.arr.splice(0, 10);
    expect(removedNumbers).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    const usedAfterRemoveNumbers = memoryStats(ob).used;
    expect(usedAfterRemoveNumbers - usedAfterCreate).toMatchInlineSnapshot(`0`);
  });

  test("splice 2", () => {
    const ob = createObjectBuffer<{ arr: any }>(
      { arrayAdditionalAllocation: 0 },
      1024 * 2,
      { arr: [] },
      { useSharedArrayBuffer: false }
    );

    const usedAfterCreate = memoryStats(ob).used;

    expect(usedAfterCreate).toMatchInlineSnapshot(`280`);

    ob.arr.push(null, null, null, null, null, null, null, null, null, null);
    const usedAfterNullPush = memoryStats(ob).used;
    expect(usedAfterNullPush - usedAfterCreate).toMatchInlineSnapshot(`48`);

    const removedNulls = ob.arr.splice(
      0,
      10,
      [1],
      [2],
      [3],
      [4],
      [5],
      [6],
      [7],
      [8],
      [9],
      [10]
    );
    expect(removedNulls).toMatchInlineSnapshot(`
      Array [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ]
    `);
    const usedAfterReplaceNullsWithNumbers = memoryStats(ob).used;

    expect(
      usedAfterReplaceNullsWithNumbers - usedAfterCreate
    ).toMatchInlineSnapshot(`768`);

    const removedArrays = ob.arr.splice(0, 10);
    expect(removedArrays).toMatchInlineSnapshot(`
      Array [
        Array [
          1,
        ],
        Array [
          2,
        ],
        Array [
          3,
        ],
        Array [
          4,
        ],
        Array [
          5,
        ],
        Array [
          6,
        ],
        Array [
          7,
        ],
        Array [
          8,
        ],
        Array [
          9,
        ],
        Array [
          10,
        ],
      ]
    `);

    const usedAfterRemovedArrays = memoryStats(ob).used;
    expect(usedAfterRemovedArrays - usedAfterCreate).toMatchInlineSnapshot(
      `768`
    );

    disposeWrapperObject(ob.arr);

    removedArrays.forEach((a: any) => disposeWrapperObject(a));

    const usedDisposeArrays = memoryStats(ob).used;
    expect(usedDisposeArrays - usedAfterCreate).toMatchInlineSnapshot(`48`);
  });
});
