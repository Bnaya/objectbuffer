/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { arraySaver } from "./arraySaver";
import {
  arrayGetMetadata,
  getFinalValueAtArrayIndex,
  setValueAtArrayIndex
} from "./arrayHelpers";

const textEncoder = new utils.TextEncoder();
const textDecoder = new utils.TextDecoder();

describe("arrayHelpers tests", () => {
  test("arrayGetMetadata", () => {
    const arrayBuffer = new ArrayBuffer(80);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

    const metadata = arrayGetMetadata(dataView, textDecoder, saverOutput.start);

    expect(metadata).toMatchInlineSnapshot(`
      Object {
        "allocatedLength": 2,
        "length": 2,
        "type": 9,
        "value": 16,
      }
    `);
  });

  describe("getFinalValueAtArrayIndex", () => {
    test("in bound index", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        dataView,
        textDecoder,
        textEncoder,
        0,
        saverOutput.start,
        0
      );

      expect(finalValue).toMatchInlineSnapshot(`1`);
    });

    test("out of bound index", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        dataView,
        textDecoder,
        textEncoder,
        0,
        saverOutput.start,
        10
      );

      expect(finalValue).toMatchInlineSnapshot(`undefined`);
    });

    test("array of strings", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b"];

      const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        dataView,
        textDecoder,
        textEncoder,
        0,
        saverOutput.start,
        1
      );

      expect(finalValue).toMatchInlineSnapshot(`"b"`);
    });
  });

  test("setValueAtArrayIndex basic", () => {
    const arrayBuffer = new ArrayBuffer(80);

    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(textEncoder, dataView, 0, arrayToSave);

    setValueAtArrayIndex(
      dataView,
      textDecoder,
      textEncoder,
      0,
      saverOutput.start,
      1,
      "im the new value"
    );

    const finalValue = getFinalValueAtArrayIndex(
      dataView,
      textDecoder,
      textEncoder,
      0,
      saverOutput.start,
      1
    );

    expect(finalValue).toMatchInlineSnapshot(`"im the new value"`);
  });
});
