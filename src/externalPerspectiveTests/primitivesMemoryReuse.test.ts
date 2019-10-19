import { ExternalArgs } from "../internal/interfaces";
import * as util from "util";
import { createObjectBuffer, getUnderlyingArrayBuffer } from "..";
import { getFirstFreeByte } from "../internal/testUtils";

/* eslint-env jest */

describe("primitivesMemoryReuse", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("test number / bigint reuse", () => {
    const objectBuffer = createObjectBuffer(externalArgs, 64, {
      num: 1 as number | bigint
    });
    const ab = getUnderlyingArrayBuffer(objectBuffer);

    const memoryAfterEachOperation: number[] = [getFirstFreeByte(ab)];

    objectBuffer.num++;
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.num = BigInt("-100");
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.num = -BigInt("18446744073709551615");

    objectBuffer.num++;

    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        52,
        52,
        52,
        52,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "num": -18446744073709551614n,
      }
    `);
  });

  test("test null/undefined reuse", () => {
    const objectBuffer = createObjectBuffer(externalArgs, 64, {
      nullContainer: null as null | undefined
    });
    const ab = getUnderlyingArrayBuffer(objectBuffer);

    const memoryAfterEachOperation: number[] = [getFirstFreeByte(ab)];

    objectBuffer.nullContainer = undefined;
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.nullContainer = null;
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
        "nullContainer": null,
      }
    `);
  });

  test("test boolean reuse", () => {
    const objectBuffer = createObjectBuffer(externalArgs, 64, {
      booleanContainer: false
    });

    const ab = getUnderlyingArrayBuffer(objectBuffer);

    const memoryAfterEachOperation: number[] = [getFirstFreeByte(ab)];

    objectBuffer.booleanContainer = true;
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    objectBuffer.booleanContainer = false;
    memoryAfterEachOperation.push(getFirstFreeByte(ab));

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        58,
        58,
        58,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "booleanContainer": false,
      }
    `);
  });
});
