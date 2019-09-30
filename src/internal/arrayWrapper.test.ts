/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";

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
      const arrayBuffer = new ArrayBuffer(128);
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
    });
  });
});
