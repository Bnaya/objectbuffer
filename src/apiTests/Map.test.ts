/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

describe("Map", () => {
  test("creation", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Map([[1, "a"]]);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`384`);
    expect(objectBuffer.foo).toMatchInlineSnapshot(`
        Map {
          1 => "a",
        }
      `);
  });

  test("add", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Map([[1, "a"]]);
    objectBuffer.foo.set("2", "b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`200`);
    expect(objectBuffer.foo).toMatchInlineSnapshot(`
        Map {
          1 => "a",
          "2" => "b",
        }
      `);
  });

  test("has", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    objectBuffer.foo = new Map([[1, "a"]]);
    objectBuffer.foo.set("2", "b");
    expect(objectBuffer.foo.has("2")).toEqual(true);
    expect(objectBuffer.foo.has("none exiting")).toEqual(false);
  });

  test("delete", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Map([[1, "a"]]);
    objectBuffer.foo.set("2", "b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`200`);

    objectBuffer.foo.delete(1);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`352`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`
        Map {
          "2" => "b",
        }
      `);
  });

  test("clear", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Map();
    const availSizeAfterCreation = memoryStats(objectBuffer).available;
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`536`);
    objectBuffer.foo.set(1, "a");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`384`);
    objectBuffer.foo.set("2", "b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`200`);

    objectBuffer.foo.clear();

    expect(memoryStats(objectBuffer).available).toBe(availSizeAfterCreation);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`Map {}`);
  });

  test("iterate", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Map([[1, "a"]]);
    objectBuffer.foo.set("2", "b");

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`200`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`
        Map {
          1 => "a",
          "2" => "b",
        }
      `);
    expect([...objectBuffer.foo.keys()]).toMatchInlineSnapshot(`
        Array [
          1,
          "2",
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
    const nativeMap = new Map([
      [1, "a"],
      [2, "b"],
    ]);
    for (const [key] of nativeMap) {
      nativeMap.delete(key);
    }

    const objectBuffer = createObjectBuffer<any>(1024, {
      foo: new Map([
        [1, "a"],
        [2, "b"],
      ]),
    });
    for (const [key] of objectBuffer.foo) {
      objectBuffer.foo.delete(key);
    }

    expect(objectBuffer.foo).toEqual(nativeMap);
  });

  test("forEach", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = new Map([[1, "a"]]);
    objectBuffer.foo.set("2", "b");

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
            "key": 1,
            "value": "a",
          },
          Object {
            "key": "2",
            "value": "b",
          },
        ]
      `);
  });
});
