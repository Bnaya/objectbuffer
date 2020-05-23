/* eslint-env jest */

import { createObjectBuffer } from "../";
import { memoryStats } from "../internal/api";

describe("bad values tests", () => {
  test("bad values tests", () => {
    const ob = createObjectBuffer<any>({}, 512, {});
    expect(memoryStats(ob).used).toMatchInlineSnapshot(`160`);

    ob.imabadFunction = () => {
      return;
    };
    ob.imabadSymbol = Symbol("badsymbolhere");

    expect(memoryStats(ob).used).toMatchInlineSnapshot(`336`);

    expect(ob).toMatchInlineSnapshot(`
      Object {
        "imabadFunction": undefined,
        "imabadSymbol": undefined,
      }
    `);
  });
});
