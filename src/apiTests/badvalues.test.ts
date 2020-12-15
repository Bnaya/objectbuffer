/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

describe("bad values tests", () => {
  test("bad values tests", () => {
    const ob = createObjectBuffer<any>(512, {});
    expect(memoryStats(ob).used).toMatchInlineSnapshot(`208`);

    const symbol = Symbol("badsymbolhere");

    ob.imabadFunction = () => {
      return;
    };
    ob.imabadSymbol = Symbol("badsymbolhere");

    expect(() => {
      ob[symbol] = "But why not";
    }).toThrowErrorMatchingInlineSnapshot(`"IllegalObjectPropConfigError"`);

    expect(memoryStats(ob).used).toMatchInlineSnapshot(`464`);

    expect(ob).toMatchInlineSnapshot(`
      Object {
        "imabadFunction": undefined,
        "imabadSymbol": undefined,
      }
    `);
  });
});
