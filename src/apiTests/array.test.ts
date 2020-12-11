/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats, reclaim } from "../internal/api";

// actually not very good, as the browser's TextEncoder won't work with SAB, but node will.
describe("SharedArrayBuffer tests", () => {
  test("basic", () => {
    const objectBuffer = createObjectBuffer<any>(1024, { arr: [1, 2, 3, 4] });

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

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`424`);
  });

  test("splice 1", () => {
    const ob = createObjectBuffer<{ arr: (number | null)[] }>(
      1024,
      { arr: [] },
      { arrayAdditionalAllocation: 10 }
    );

    const usedAfterCreate = memoryStats(ob).used;

    expect(usedAfterCreate).toMatchInlineSnapshot(`424`);

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
    ).toMatchInlineSnapshot(`320`);

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
      1024 * 2,
      { arr: [] },
      { arrayAdditionalAllocation: 0 }
    );

    const usedAfterCreate = memoryStats(ob).used;

    expect(usedAfterCreate).toMatchInlineSnapshot(`368`);

    ob.arr.push(null, null, null, null, null, null, null, null, null, null);
    const usedAfterNullPush = memoryStats(ob).used;
    expect(usedAfterNullPush - usedAfterCreate).toMatchInlineSnapshot(`56`);

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
    ).toMatchInlineSnapshot(`1016`);

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
      `1016`
    );

    reclaim(ob.arr);

    removedArrays.forEach((a: any) => reclaim(a));

    const usedDisposeArrays = memoryStats(ob).used;
    expect(usedDisposeArrays - usedAfterCreate).toMatchInlineSnapshot(`56`);
  });

  test("flat", () => {
    const input = [[{ v: 1 }], [{ v: 2 }], [{ v: 3 }], [{ v: 4 }]];

    const o = createObjectBuffer(
      1024 * 2,
      {
        arr: input,
      },
      { arrayAdditionalAllocation: 0 }
    );

    const output = o.arr.flat();

    expect(output).toMatchInlineSnapshot(`
      Array [
        Object {
          "v": 1,
        },
        Object {
          "v": 2,
        },
        Object {
          "v": 3,
        },
        Object {
          "v": 4,
        },
      ]
    `);
  });

  test("flatMap", () => {
    const input = [[{ v: 1 }], [{ v: 2 }], [{ v: 3 }], [{ v: 4 }]];

    const o = createObjectBuffer(1024 * 2, {
      arr: input,
    });

    const output = o.arr.flatMap((v) => v[0].v + 1);

    expect(output).toMatchInlineSnapshot(`
      Array [
        2,
        3,
        4,
        5,
      ]
    `);
  });
});
