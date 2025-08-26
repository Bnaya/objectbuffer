/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

describe("Set tests", () => {
  test("creation", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Set(["a"]);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`416`);
    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
      }
    `);
  });

  test("add", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`296`);
    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
        "b",
      }
    `);
  });

  test("has", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(objectBuffer.foo.has("b")).toEqual(true);
    expect(objectBuffer.foo.has("none exiting")).toEqual(false);
  });

  test("delete", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`296`);

    objectBuffer.foo.delete(1);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`296`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
        "b",
      }
    `);
  });

  test("clear", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`296`);

    objectBuffer.foo.clear();

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`536`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`Set {}`);
  });

  test("iterate", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`296`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
        "b",
      }
    `);
    expect([...objectBuffer.foo.keys()]).toMatchInlineSnapshot(`
      [
        "a",
        "b",
      ]
    `);

    expect([...objectBuffer.foo.values()]).toMatchInlineSnapshot(`
      [
        "a",
        "b",
      ]
    `);
  });

  // bug with deletion during iteration
  // eslint-disable-next-line no-disabled-tests
  test.skip("iterate + delete compare", () => {
    const nativeMap = new Set(["a", "b"]);
    for (const [key] of nativeMap) {
      nativeMap.delete(key);
    }

    const objectBuffer = createObjectBuffer<any>(1024, {
      foo: new Set(["a", "b"]),
    });
    for (const [key] of objectBuffer.foo) {
      objectBuffer.foo.delete(key);
    }

    expect(objectBuffer.foo).toEqual(nativeMap);
  });

  test("forEach", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");

    const dump: any[] = [];
    const thisArgs: any[] = [];

    objectBuffer.foo.forEach((value: any, key: any, map: any) => {
      thisArgs.push(map);
      dump.push({ value, key });
    });

    expect(thisArgs.every((v) => v === objectBuffer.foo)).toBe(true);

    expect(dump).toMatchInlineSnapshot(`
      [
        {
          "key": "a",
          "value": "a",
        },
        {
          "key": "b",
          "value": "b",
        },
      ]
    `);
  });
});

describe("new set methods", () => {
  test.failing("union", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {});
    objectBuffer.setA = new Set([1, 2, 3]);
    objectBuffer.setB = new Set([3, 4, 5]);

    const result = objectBuffer.setA.union(objectBuffer.setB);
    expect([...result]).toMatchInlineSnapshot(`[1, 2, 3, 4, 5]`);
  });

  test.failing("intersection", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {});
    objectBuffer.setA = new Set([1, 2, 3]);
    objectBuffer.setB = new Set([3, 4, 5]);

    const result = objectBuffer.setA.intersection(objectBuffer.setB);
    expect([...result]).toMatchInlineSnapshot(`[3]`);
  });

  test.failing("difference", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {});
    objectBuffer.setA = new Set([1, 2, 3]);
    objectBuffer.setB = new Set([3, 4, 5]);

    const result = objectBuffer.setA.difference(objectBuffer.setB);
    expect([...result]).toMatchInlineSnapshot(`[1, 2]`);
  });

  test.failing("symmetricDifference", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {});
    objectBuffer.setA = new Set([1, 2, 3]);
    objectBuffer.setB = new Set([3, 4, 5]);

    const result = objectBuffer.setA.symmetricDifference(objectBuffer.setB);
    expect([...result]).toMatchInlineSnapshot(`[1, 2, 4, 5]`);
  });

  test.failing("isSubsetOf", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {});
    objectBuffer.setA = new Set([1, 2]);
    objectBuffer.setB = new Set([1, 2, 3]);

    expect(objectBuffer.setA.isSubsetOf(objectBuffer.setB)).toBe(true);
    expect(objectBuffer.setB.isSubsetOf(objectBuffer.setA)).toBe(false);
  });

  test.failing("isSupersetOf", () => {
    const objectBuffer = createObjectBuffer<any>(2048, {});
    objectBuffer.setA = new Set([1, 2, 3]);
    objectBuffer.setB = new Set([1, 2]);

    expect(objectBuffer.setA.isSupersetOf(objectBuffer.setB)).toBe(true);
    expect(objectBuffer.setB.isSupersetOf(objectBuffer.setA)).toBe(false);
  });

  test.failing("isDisjointFrom", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    objectBuffer.setA = new Set([1, 2, 3]);
    objectBuffer.setB = new Set([4, 5, 6]);
    objectBuffer.setC = new Set([3, 4, 5]);

    expect(objectBuffer.setA.isDisjointFrom(objectBuffer.setB)).toBe(true);
    expect(objectBuffer.setA.isDisjointFrom(objectBuffer.setC)).toBe(false);
  });
});
