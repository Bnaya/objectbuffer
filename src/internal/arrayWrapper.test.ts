/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { getFirstFreeByte } from "./testUtils";

describe("arrayWrapper tests", () => {
  const textEncoder = new utils.TextEncoder();
  const textDecoder = new utils.TextDecoder();

  describe("arrayWrapper - general", () => {
    test("arrayWrapper class 1", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        dataView,
        0,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`66`);
    });

    test("arrayWrapper array.keys()", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const arrayWrapper = createArrayWrapper(
        dataView,
        0,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      expect([...arrayWrapper.keys()]).toEqual([0, 1, 2]);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`66`);
    });

    test("arrayWrapper array.entries()", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const arrayWrapper = createArrayWrapper(
        dataView,
        0,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      expect([...arrayWrapper.entries()]).toMatchInlineSnapshot(`
        Array [
          Array [
            0,
            "a",
          ],
          Array [
            1,
            "b",
          ],
          Array [
            2,
            1,
          ],
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`66`);
    });

    test("arrayWrapper array.values() & iterator", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const arrayWrapper = createArrayWrapper(
        dataView,
        0,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      expect([...arrayWrapper.values()]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);
      expect([...arrayWrapper]).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`66`);
    });

    test("arrayWrapper set value in bound", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        dataView,
        0,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      arrayWrapper[1] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "new value",
          1,
        ]
      `);
    });

    test("arrayWrapper set value out of bound, but inside allocated space", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 15, arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        dataView,
        15,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      arrayWrapper[10] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "new value",
        ]
      `);
    });

    test("arrayWrapper set value out of bound, but outside allocated space", () => {
      const arrayBuffer = new ArrayBuffer(134);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b", 1];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const arrayWrapper: any = createArrayWrapper(
        dataView,
        3,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      arrayWrapper[10] = "new value";

      expect(arrayWrapper).toMatchInlineSnapshot(`
        Array [
          "a",
          "b",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          "new value",
        ]
      `);
      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`134`);
    });
  });

  test("arrayWrapper sort - no comparator", () => {
    const arrayBuffer = new ArrayBuffer(128);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [2, 1, null, 3, 10, undefined, 6, 77];

    const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

    const arrayWrapper = createArrayWrapper(
      dataView,
      3,
      saverOutput.start,
      textDecoder,
      textEncoder
    );

    arrayWrapper.sort();

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        10,
        2,
        3,
        6,
        77,
        null,
        undefined,
      ]
    `);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`125`);
  });

  test("arrayWrapper sort - with comparator", () => {
    const arrayBuffer = new ArrayBuffer(256);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [2, 1, 3, 10, 6, 77].map(value => ({
      value
    }));

    const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

    const arrayWrapper = createArrayWrapper(
      dataView,
      3,
      saverOutput.start,
      textDecoder,
      textEncoder
    );

    arrayWrapper.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      } else if (b.value > a.value) {
        return -1;
      } else {
        return 0;
      }
    });

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        Object {
          "value": 1,
        },
        Object {
          "value": 2,
        },
        Object {
          "value": 3,
        },
        Object {
          "value": 6,
        },
        Object {
          "value": 10,
        },
        Object {
          "value": 77,
        },
      ]
    `);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`241`);
  });
});
