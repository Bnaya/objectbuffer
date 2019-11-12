/* eslint-env jest */

import * as util from "util";

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";

describe("Set tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder()
  });

  test("creation", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`872`);

    objectBuffer.foo = new Set(["a"]);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`648`);
    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
      }
    `);
  });

  test("add", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`872`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`576`);
    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
        "b",
      }
    `);
  });

  test("has", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(objectBuffer.foo.has("b")).toEqual(true);
    expect(objectBuffer.foo.has("none exiting")).toEqual(false);
  });

  test("delete", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`872`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`576`);

    objectBuffer.foo.delete(1);

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`576`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "a",
        "b",
      }
    `);
  });

  test("clear", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`872`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`576`);

    objectBuffer.foo.clear();

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`704`);

    expect(objectBuffer.foo).toMatchInlineSnapshot(`
      Set {
        "b",
      }
    `);
  });

  test("iterate", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`872`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");

    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`576`);

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

    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {
      foo: new Set(["a", "b"])
    });
    for (const [key] of objectBuffer.foo) {
      objectBuffer.foo.delete(key);
    }

    expect(objectBuffer.foo).toEqual(nativeMap);
  });

  test("forEach", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`872`);

    objectBuffer.foo = new Set(["a"]);
    objectBuffer.foo.add("b");

    const dump: any[] = [];
    const thisArgs: any[] = [];

    objectBuffer.foo.forEach((value: any, key: any, map: any) => {
      thisArgs.push(map);
      dump.push({ value, key });
    });

    expect(thisArgs.every(v => v === objectBuffer.foo)).toBe(true);

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
