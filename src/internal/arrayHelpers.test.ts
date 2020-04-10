/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arraySaver } from "./arraySaver";
import {
  arrayGetMetadata,
  getFinalValueAtArrayIndex,
  setValueAtArrayIndex,
} from "./arrayHelpers";
import { ExternalArgs } from "./interfaces";
import { MemPool } from "@thi.ng/malloc";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { makeCarrier } from "./testUtils";

const externalArgs: ExternalArgs = externalArgsApiToExternalArgsApi({
  textEncoder: new util.TextEncoder(),
  textDecoder: new util.TextDecoder(),
  arrayAdditionalAllocation: 0,
});

describe("arrayHelpers tests", () => {
  test("arrayGetMetadata", () => {
    const arrayBuffer = new ArrayBuffer(256);
    const carrier = makeCarrier(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    const metadata = arrayGetMetadata(carrier, saverOutput);

    expect(metadata).toMatchInlineSnapshot(`
      Object {
        "allocatedLength": 2,
        "length": 2,
        "refsCount": 1,
        "type": 9,
        "value": 48,
      }
    `);

    expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`120`);
  });

  describe("getFinalValueAtArrayIndex", () => {
    test("in bound index", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        carrier,
        saverOutput,
        0
      );

      expect(finalValue).toMatchInlineSnapshot(`1`);
      expect(allocator.stats().available).toMatchInlineSnapshot(`120`);
    });

    test("out of bound index", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        carrier,
        saverOutput,
        10
      );

      expect(finalValue).toMatchInlineSnapshot(`undefined`);
      expect(allocator.stats().available).toMatchInlineSnapshot(`120`);
    });

    test("array of strings", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const carrier = makeCarrier(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START,
      });

      const arrayToSave = ["a", "b"];

      const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        carrier,
        saverOutput,
        1
      );

      expect(finalValue).toMatchInlineSnapshot(`"b"`);
      expect(allocator.stats().available).toMatchInlineSnapshot(`120`);
    });
  });

  test("setValueAtArrayIndex basic", () => {
    const arrayBuffer = new ArrayBuffer(256);

    const carrier = makeCarrier(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START,
    });

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(externalArgs, carrier, [], arrayToSave);

    setValueAtArrayIndex(
      externalArgs,
      carrier,
      saverOutput,
      1,
      "im the new value"
    );

    const finalValue = getFinalValueAtArrayIndex(
      externalArgs,
      carrier,
      saverOutput,
      1
    );

    expect(finalValue).toMatchInlineSnapshot(`"im the new value"`);
    expect(allocator.stats().available).toMatchInlineSnapshot(`104`);
  });
});
