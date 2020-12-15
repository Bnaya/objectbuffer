import { createObjectBuffer } from "..";
import { memoryStats } from "../internal/api";

/* eslint-env jest */

describe.skip("primitivesMemoryReuse", () => {
  test("test number / bigint reuse", () => {
    const objectBuffer = createObjectBuffer(128, {
      num: 1 as number | bigint,
    });

    const memoryAfterEachOperation: number[] = [memoryStats(objectBuffer).used];

    objectBuffer.num++;
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.num = BigInt("-100");
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.num = -BigInt("18446744073709551615");

    objectBuffer.num++;

    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        96,
        96,
        96,
        96,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "num": -18446744073709551614n,
      }
    `);
  });

  test("test null/undefined reuse", () => {
    const objectBuffer = createObjectBuffer(128, {
      nullContainer: null as null | undefined,
    });

    const memoryAfterEachOperation: number[] = [memoryStats(objectBuffer).used];

    objectBuffer.nullContainer = undefined;
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.nullContainer = null;
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        96,
        96,
        96,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "nullContainer": null,
      }
    `);
  });

  test("test boolean reuse", () => {
    const objectBuffer = createObjectBuffer(128, {
      booleanContainer: false,
    });

    const memoryAfterEachOperation: number[] = [memoryStats(objectBuffer).used];

    objectBuffer.booleanContainer = true;
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    objectBuffer.booleanContainer = false;
    memoryAfterEachOperation.push(memoryStats(objectBuffer).used);

    expect(memoryAfterEachOperation).toMatchInlineSnapshot(`
      Array [
        104,
        104,
        104,
      ]
    `);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "booleanContainer": false,
      }
    `);
  });
});
