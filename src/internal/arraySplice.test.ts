/* eslint-env jest */

import { createObjectBuffer } from "..";
import { memoryStats } from "./api";

describe("arraySplice tests", () => {
  test("arrayWrapper splice - add + delete - array stay in same length", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(2, 3, "a", "b", "c");
    const removedFromPlain = plainJSArray.splice(2, 3, "a", "b", "c");

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);
  });

  test("arrayWrapper splice - Just delete items from the middle", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const arrayWrapper = ob.arr;

    arrayWrapper.splice(2, 3);
    plainJSArray.splice(2, 3);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);
  });

  test("arrayWrapper splice - Just add items in the middle", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const arrayWrapper = ob.arr;

    arrayWrapper.splice(4, 0, "a", "b");
    plainJSArray.splice(4, 0, "a", "b");

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        "a",
        "b",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        "a",
        "b",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);
  });

  test("arrayWrapper splice - add + delete - array will get longer", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 3 }
    );

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(2, 2, "a", "b", "c", "d");
    const removedFromPlain = plainJSArray.splice(2, 2, "a", "b", "c", "d");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`12`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);
  });

  test("arrayWrapper splice - add + delete - array will get shorter", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      2048,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const availableCheckpoint = memoryStats(ob).available;

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(2, 6, "a", "b", "c", "d");
    const removedFromPlain = plainJSArray.splice(2, 6, "a", "b", "c", "d");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`8`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`8`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
        6,
        7,
        8,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
        6,
        7,
        8,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);

    expect(
      availableCheckpoint - memoryStats(ob).available
    ).toMatchInlineSnapshot(`64`);
  });

  test("arrayWrapper splice - start bigger than array", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(12, 3, "a", "b");
    const removedFromPlain = plainJSArray.splice(12, 3, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`12`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`12`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
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
        "a",
        "b",
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
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
        "a",
        "b",
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`Array []`);
    expect(removedFromPlain).toMatchInlineSnapshot(`Array []`);

    expect(removedFromPlain).toEqual([...removed]);
  });

  test("arrayWrapper splice - delete bigger than array", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(2, 20, "a", "b");
    const removedFromPlain = plainJSArray.splice(2, 20, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`4`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`4`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
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
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
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

    expect(removedFromPlain).toEqual([...removed]);
  });

  test("arrayWrapper splice - negative start", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 20 }
    );

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(-4, 1, "a", "b");
    const removedFromPlain = plainJSArray.splice(-4, 1, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`11`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`11`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        "a",
        "b",
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        "a",
        "b",
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        7,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        7,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);
  });

  test("arrayWrapper splice - negative delete", () => {
    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const ob = createObjectBuffer(
      1024,
      {
        arr: plainJSArray,
      },
      { arrayAdditionalAllocation: 3 }
    );

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(4, -1, 50, 51);
    const removedFromPlain = plainJSArray.splice(4, -1, 50, 51);

    expect(arrayWrapper.length).toMatchInlineSnapshot(`12`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`12`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        50,
        51,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        50,
        51,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`Array []`);
    expect(removedFromPlain).toMatchInlineSnapshot(`Array []`);

    expect(removedFromPlain).toEqual([...removed]);
  });

  test("splice - out of bound", () => {
    const plainJSArray: any[] = [1, 2, 3];
    const ob = createObjectBuffer(1024, {
      arr: plainJSArray,
    });

    const arrayWrapper = ob.arr;

    const removed = arrayWrapper.splice(10, 2, "a", "b");
    const removedFromPlain = plainJSArray.splice(10, 2, "a", "b");

    expect(plainJSArray).toEqual([...arrayWrapper]);
    expect(removedFromPlain).toEqual([...removed]);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        "a",
        "b",
      ]
    `);
    expect(removed).toMatchInlineSnapshot(`Array []`);
  });
});
