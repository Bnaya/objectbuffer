/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { arraySaver } from "./arraySaver";
import {
  arrayGetMetadata,
  getFinalValueAtArrayIndex,
  setValueAtArrayIndex
} from "./arrayHelpers";
import { ExternalArgs } from "./interfaces";
import { MemPool } from "@thi.ng/malloc";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";

const externalArgs: ExternalArgs = externalArgsApiToExternalArgsApi({
  textEncoder: new util.TextEncoder(),
  textDecoder: new util.TextDecoder(),
  arrayAdditionalAllocation: 0,
  minimumStringAllocation: 0
});

describe("arrayHelpers tests", () => {
  test("arrayGetMetadata", () => {
    const arrayBuffer = new ArrayBuffer(256);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START
    });

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(
      externalArgs,
      { dataView, allocator },
      [],
      arrayToSave
    );

    const metadata = arrayGetMetadata(externalArgs, dataView, saverOutput);

    expect(metadata).toMatchInlineSnapshot(`
      Object {
        "allocatedLength": 2,
        "length": 2,
        "refsCount": 1,
        "type": 9,
        "value": 48,
      }
    `);

    expect(allocator.stats().available).toMatchInlineSnapshot(`128`);
  });

  describe("getFinalValueAtArrayIndex", () => {
    test("in bound index", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(
        externalArgs,
        { dataView, allocator },
        [],
        arrayToSave
      );

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        { dataView, allocator },
        saverOutput,
        0
      );

      expect(finalValue).toMatchInlineSnapshot(`1`);
      expect(allocator.stats().available).toMatchInlineSnapshot(`128`);
    });

    test("out of bound index", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const arrayToSave = [1, 2];

      const saverOutput = arraySaver(
        externalArgs,
        { dataView, allocator },
        [],
        arrayToSave
      );

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        { dataView, allocator },
        saverOutput,
        10
      );

      expect(finalValue).toMatchInlineSnapshot(`undefined`);
      expect(allocator.stats().available).toMatchInlineSnapshot(`128`);
    });

    test("array of strings", () => {
      const arrayBuffer = new ArrayBuffer(256);

      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const arrayToSave = ["a", "b"];

      const saverOutput = arraySaver(
        externalArgs,
        { dataView, allocator },
        [],
        arrayToSave
      );

      const finalValue = getFinalValueAtArrayIndex(
        externalArgs,
        { dataView, allocator },
        saverOutput,
        1
      );

      expect(finalValue).toMatchInlineSnapshot(`"b"`);
      expect(allocator.stats().available).toMatchInlineSnapshot(`144`);
    });
  });

  test("setValueAtArrayIndex basic", () => {
    const arrayBuffer = new ArrayBuffer(256);

    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);
    const allocator = new MemPool({
      buf: arrayBuffer,
      start: MEM_POOL_START
    });

    const arrayToSave = [1, 2];

    const saverOutput = arraySaver(
      externalArgs,
      { dataView, allocator },
      [],
      arrayToSave
    );

    setValueAtArrayIndex(
      externalArgs,
      { dataView, allocator },
      saverOutput,
      1,
      "im the new value"
    );

    const finalValue = getFinalValueAtArrayIndex(
      externalArgs,
      { dataView, allocator },
      saverOutput,
      1
    );

    expect(finalValue).toMatchInlineSnapshot(`"im the new value"`);
    expect(allocator.stats().available).toMatchInlineSnapshot(`120`);
  });
});
