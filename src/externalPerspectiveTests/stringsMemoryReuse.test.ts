import { ExternalArgs } from "../internal/interfaces";
import * as util from "util";
import { createObjectBuffer, getUnderlyingArrayBuffer } from "..";
import { getFirstFreeByte } from "../internal/testUtils";

/* eslint-env jest */

describe("stringsMemoryReuse.test", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("setting a shorter string, and then as original size again", () => {
    const objectBuffer = createObjectBuffer(externalArgs, 64, {
      str: "abc"
    });
    const ab = getUnderlyingArrayBuffer(objectBuffer);

    const memoryAfterEachOperation: number[] = [getFirstFreeByte(ab)];

    objectBuffer.str = "ab";
    expect(objectBuffer).toMatchInlineSnapshot(`
          Object {
            "str": "ab",
          }
      `);
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.str = "123";

    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        54,
        54,
        54,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "str": "123",
      }
    `);
  });

  test("minimumStringAllocation", () => {
    const objectBuffer = createObjectBuffer(
      { ...externalArgs, minimumStringAllocation: 10 },
      128,
      {
        str: "123"
      }
    );
    const ab = getUnderlyingArrayBuffer(objectBuffer);

    const memoryAfterEachOperation: number[] = [getFirstFreeByte(ab)];

    objectBuffer.str = "1234567890";
    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "str": "1234567890",
      }
    `);
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.str = "123";
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.str = "1234567890".repeat(2);
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        61,
        61,
        61,
        106,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "str": "12345678901234567890",
      }
    `);
  });
});
