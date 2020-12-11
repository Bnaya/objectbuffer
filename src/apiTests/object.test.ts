/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";
import { MAX_64_BIG_INT } from "../internal/consts";

describe("object tests", () => {
  test("delete object prop", () => {
    const objectBuffer = createObjectBuffer<any>(1024, {});
    const sizeBeforeSet = memoryStats(objectBuffer).available;
    expect(sizeBeforeSet).toMatchInlineSnapshot(`816`);

    objectBuffer.foo = "a";
    objectBuffer.foo.toString();
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`632`);

    delete objectBuffer.foo;

    expect(memoryStats(objectBuffer).available).toBe(sizeBeforeSet);
    expect(objectBuffer).toMatchInlineSnapshot(`Object {}`);
  });

  test("Basic object with values", () => {
    const input = {
      a: 1,
      b: true,
      c: false,
      d: null,
      e: undefined,
      foo: { a: 1, b: true, c: false, d: null, e: undefined },
      bigintPositive: MAX_64_BIG_INT,
      bigintNegative: MAX_64_BIG_INT * BigInt("-1"),
      "😌😌": "😌😌😌😌😌😌",
    };

    const objectBuffer = createObjectBuffer<any>(2048, input);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`80`);
    expect(input).toEqual(objectBuffer);
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "b": true,
        "bigintNegative": -18446744073709551615n,
        "bigintPositive": 18446744073709551615n,
        "c": false,
        "d": null,
        "e": undefined,
        "foo": Object {
          "a": 1,
          "b": true,
          "c": false,
          "d": null,
          "e": undefined,
        },
        "😌😌": "😌😌😌😌😌😌",
      }
    `);
  });

  test("With circular", () => {
    const input: any = {
      a: 1,
      b: true,
      c: false,
      d: null,
      e: undefined,
      foo: { a: 1, b: true, c: false, d: null, e: undefined },
    };

    // Create circularity
    input.foo.circular = input.foo;

    const objectBuffer = createObjectBuffer<any>(2048, input);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`496`);
    expect(input).toEqual(objectBuffer);

    expect(objectBuffer.foo.circular).toEqual(objectBuffer.foo);
    expect(objectBuffer.foo.circular.d).toMatchInlineSnapshot(`null`);

    objectBuffer.foo.circular = "severe the circularity";

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "b": true,
        "c": false,
        "d": null,
        "e": undefined,
        "foo": Object {
          "a": 1,
          "b": true,
          "c": false,
          "circular": "severe the circularity",
          "d": null,
          "e": undefined,
        },
      }
    `);
  });

  test("Same strings, same memory", () => {
    const input1: any = {
      a: "STR",
      b: undefined,
      c: undefined,
      d: undefined,
      e: undefined,
    };

    const input2: any = {
      a: "STR",
      b: "STR",
      c: "STR",
      d: "STR",
      e: "STR",
    };

    const ob1 = createObjectBuffer<any>(2048, input1);
    const ob2 = createObjectBuffer<any>(2048, input2);

    expect(memoryStats(ob1).available).toBe(memoryStats(ob2).available);

    expect(memoryStats(ob1).available).toMatchInlineSnapshot(`1176`);
  });
});
