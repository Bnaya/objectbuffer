/* eslint-env jest */

import { createObjectBuffer, memoryStats } from "./api";

describe("arrayWrapper tests", () => {
  describe("arrayWrapper - general", () => {
    test("arrayWrapper class 1", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        1024,
        { arrayToSave },
        { arrayAdditionalAllocation: 20 }
      ).arrayToSave;

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);

      expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`376`);
    });

    test("arrayWrapper array.keys()", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        1024,
        { arrayToSave },
        { arrayAdditionalAllocation: 20 }
      ).arrayToSave;

      expect([...arrayWrapper.keys()]).toEqual([0, 1, 2]);

      expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`376`);
    });

    test("arrayWrapper array.entries()", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        1024,
        { arrayToSave },
        { arrayAdditionalAllocation: 20 }
      ).arrayToSave;

      expect([...arrayWrapper.entries()]).toMatchInlineSnapshot(`
        Array [
          Array [
            0,
            "a",
          ],
          Array [
            1,
            "b",
          ],
          Array [
            2,
            1,
          ],
        ]
      `);

      expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`376`);
    });

    test("arrayWrapper array.values() & iterator", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        1024,
        { arrayToSave },
        { arrayAdditionalAllocation: 20 }
      ).arrayToSave;

      expect([...arrayWrapper.values()]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);
      expect([...arrayWrapper]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);

      expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`376`);
    });

    test("arrayWrapper set value in bound", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        1024,
        { arrayToSave },
        { arrayAdditionalAllocation: 20 }
      ).arrayToSave;

      arrayWrapper[1] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "new value",
          1,
        ]
      `);
    });

    test("arrayWrapper set value out of bound, but inside allocated space", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        768,
        { arrayToSave },
        { arrayAdditionalAllocation: 15 }
      ).arrayToSave;

      arrayWrapper[10] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "new value",
        ]
      `);
    });

    test("arrayWrapper set value out of bound, but outside allocated space", () => {
      const arrayToSave = ["a", "b", 1];

      const arrayWrapper = createObjectBuffer(
        1024,
        { arrayToSave },
        { arrayAdditionalAllocation: 3 }
      ).arrayToSave;

      arrayWrapper[10] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "new value",
        ]
      `);
      expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`344`);
    });
  });

  test("arrayWrapper sort - no comparator", () => {
    const arrayToSave = [2, 1, null, 3, 10, undefined, 6, 77];

    const arrayWrapper = createObjectBuffer(
      1024,
      { arrayToSave },
      { arrayAdditionalAllocation: 3 }
    ).arrayToSave;

    arrayWrapper.sort();

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        10,
        2,
        3,
        6,
        77,
        null,
        undefined,
      ]
    `);

    expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`392`);
  });

  test("arrayWrapper sort - with comparator", () => {
    const arrayToSave = [2, 1, 3, 10, 6, 77].map((value) => ({
      value,
    }));

    const arrayWrapper = createObjectBuffer(
      1024 * 2,
      { arrayToSave },
      { arrayAdditionalAllocation: 3 }
    ).arrayToSave;

    arrayWrapper.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      } else if (b.value > a.value) {
        return -1;
      } else {
        return 0;
      }
    });

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        Object {
          "value": 1,
        },
        Object {
          "value": 2,
        },
        Object {
          "value": 3,
        },
        Object {
          "value": 6,
        },
        Object {
          "value": 10,
        },
        Object {
          "value": 77,
        },
      ]
    `);

    expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`64`);
  });

  test("arrayWrapper - reverse", () => {
    const arrayToSave = [1, 2, 3, 4, 5, 6, 7];

    const arrayWrapper = createObjectBuffer(
      1024,
      { arrayToSave },
      { arrayAdditionalAllocation: 3 }
    ).arrayToSave;

    arrayWrapper.reverse();
    arrayWrapper.reverse();
    const r = arrayWrapper.reverse();

    expect(r).toBe(arrayWrapper);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        7,
        6,
        5,
        4,
        3,
        2,
        1,
      ]
    `);

    expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`368`);
  });

  test("arrayWrapper - set length", () => {
    const arrayToSave = [1, 2, 3, 4, 5, 6, 7];

    const arrayWrapper = createObjectBuffer(
      1024,
      { arrayToSave },
      { arrayAdditionalAllocation: 3 }
    ).arrayToSave;

    arrayWrapper.length = 10;
    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        undefined,
        undefined,
        undefined,
      ]
    `);

    arrayWrapper.length = 1;
    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
      ]
    `);

    expect(() => {
      arrayWrapper.length = -1;
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid array length"`);

    expect(() => {
      arrayWrapper.length = ("a" as unknown) as number;
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid array length"`);

    expect(() => {
      arrayWrapper.length = 2.2;
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid array length"`);

    expect(memoryStats(arrayWrapper).available).toMatchInlineSnapshot(`560`);
  });
});
