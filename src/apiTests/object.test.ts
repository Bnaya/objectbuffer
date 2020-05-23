/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";
import { externalArgsApiToExternalArgsApi } from "../internal/utils";
import { MAX_64_BIG_INT } from "../internal/consts";

describe("object tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({});

  test("delete object prop", () => {
    const objectBuffer = createObjectBuffer<any>(externalArgs, 1024, {});
    const sizeBeforeSet = memoryStats(objectBuffer).available;
    expect(sizeBeforeSet).toMatchInlineSnapshot(`864`);

    objectBuffer.foo = "a";
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`744`);

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
    };

    const objectBuffer = createObjectBuffer<any>(externalArgs, 2048, input);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`600`);
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
      }
    `);
  });

  // Not working. will make infinite loop
  test.skip("With circular", () => {
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

    const objectBuffer = createObjectBuffer<any>(externalArgs, 2048, input);
    expect(memoryStats(objectBuffer).available).toMatchInlineSnapshot(`1016`);
    expect(input).toEqual(objectBuffer);

    expect(objectBuffer.foo.circular).toEqual(objectBuffer.foo);
    expect(objectBuffer.foo.circular.d).toMatchInlineSnapshot();

    objectBuffer.foo.circular = "severe the circularity";

    expect(objectBuffer).toMatchInlineSnapshot();
  });
});
