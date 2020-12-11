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
      Array [
        "a",
        "b",
      ]
    `);

    expect([...objectBuffer.foo.values()]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
        ]
      `);
  });

  // bug with deletion during iteration
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
      Array [
        Object {
          "key": "a",
          "value": "a",
        },
        Object {
          "key": "b",
          "value": "b",
        },
      ]
    `);
  });
});
