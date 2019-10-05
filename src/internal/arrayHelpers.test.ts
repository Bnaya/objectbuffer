/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arraySaver } from "./arraySaver";
import {
  arrayGetMetadata,
  getFinalValueAtArrayIndex,
  setValueAtArrayIndex
} from "./arrayHelpers";
import { getFirstFreeByte } from "./testUtils";
import { ExternalArgs } from "./interfaces";

const externalArgs: ExternalArgs = {
  textEncoder: new util.TextEncoder(),
  textDecoder: new util.TextDecoder(),
  arrayAdditionalAllocation: 0,
  minimumStringAllocation: 0
};

describe("arrayHelpers tests", () => {
  test("arrayGetMetadata", () => {
    const arrayBuffer = new ArrayBuffer(80);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

    const metadata = arrayGetMetadata(
      externalArgs,
      dataView,
      saverOutput.start
    );

    expect(metadata).toMatchInlineSnapshot(`
      Object {
        "allocatedLength": 2,
        "length": 2,
        "type": 9,
        "value": 24,
      }
    `);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`63`);
  });

  describe("getFinalValueAtArrayIndex", () => {
    test("in bound index", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        dataView,
        saverOutput.start,
        0
      );

      expect(finalValue).toMatchInlineSnapshot(`1`);
      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`63`);
    });

    test("out of bound index", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        dataView,
        saverOutput.start,
        10
      );

      expect(finalValue).toMatchInlineSnapshot(`undefined`);
      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`63`);
    });

    test("array of strings", () => {
      const arrayBuffer = new ArrayBuffer(80);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const arrayToSave = ["a", "b"];

      const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        dataView,
        saverOutput.start,
        1
      );

      expect(finalValue).toMatchInlineSnapshot(`"b"`);
      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`53`);
    });
  });

  test("setValueAtArrayIndex basic", () => {
    const arrayBuffer = new ArrayBuffer(84);

    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(externalArgs, dataView, arrayToSave);

    setValueAtArrayIndex(
      externalArgs,
      dataView,
      saverOutput.start,
      1,
      "im the new value"
    );

    const finalValue = getFinalValueAtArrayIndex(
      externalArgs,
      dataView,
      saverOutput.start,
      1
    );

    expect(finalValue).toMatchInlineSnapshot(`"im the new value"`);
    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`82`);
  });
});
