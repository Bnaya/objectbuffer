/* eslint-env jest */

import { initializeArrayBuffer, readEntry } from "./store";
import * as util from "util";
import { objectSaver } from "./objectSaver";
import {
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey
} from "./objectWrapperHelpers";
import { MemPool } from "@thi.ng/malloc";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { ObjectEntry } from "./interfaces";

describe("objectWrapperHelpers tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  describe("objectWrapperHelpers - general", () => {
    test("getObjectPropertiesEntries", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7
        }
      };

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      const hashmapPointer = (readEntry(
        externalArgs,
        dataView,
        saverOutput
      ) as ObjectEntry).value;

      const gotEntries = getObjectPropertiesEntries(
        externalArgs,
        dataView,
        hashmapPointer
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "5",
            "valuePointer": 0,
          },
          Object {
            "key": "a",
            "valuePointer": 256,
          },
          Object {
            "key": "kawabanga",
            "valuePointer": 1,
          },
          Object {
            "key": "b",
            "valuePointer": 400,
          },
          Object {
            "key": "nestedObject",
            "valuePointer": 680,
          },
        ]
      `);
    });
    test("deleteObjectPropertyEntryByKey - delete first one", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      expect(allocator.stats().available).toMatchInlineSnapshot(`88`);

      const hashmapPointer = (readEntry(
        externalArgs,
        dataView,
        saverOutput
      ) as ObjectEntry).value;

      deleteObjectPropertyEntryByKey(
        externalArgs,
        { dataView, allocator },
        hashmapPointer,
        "a"
      );

      expect(allocator.stats().available).toMatchInlineSnapshot(`168`);

      const gotEntries = getObjectPropertiesEntries(
        externalArgs,
        dataView,
        hashmapPointer
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "b",
            "valuePointer": 280,
          },
          Object {
            "key": "c",
            "valuePointer": 0,
          },
          Object {
            "key": "d",
            "valuePointer": 1,
          },
        ]
      `);
    });

    test("deleteObjectPropertyEntryByKey - delete last one", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      expect(allocator.stats().available).toMatchInlineSnapshot(`88`);

      const hashmapPointer = (readEntry(
        externalArgs,
        dataView,
        saverOutput
      ) as ObjectEntry).value;

      deleteObjectPropertyEntryByKey(
        externalArgs,
        { dataView, allocator },
        hashmapPointer,
        "d"
      );

      expect(getObjectPropertiesEntries(externalArgs, dataView, hashmapPointer))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "a",
            "valuePointer": 200,
          },
          Object {
            "key": "b",
            "valuePointer": 280,
          },
          Object {
            "key": "c",
            "valuePointer": 0,
          },
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`144`);
    });

    test("deleteObjectPropertyEntryByKey - delete in the middle", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null,
        e: 66
      };

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );
      expect(allocator.stats().available).toMatchInlineSnapshot(`8`);

      const hashmapPointer = readEntry(
        externalArgs,
        dataView,
        saverOutput
      ) as ObjectEntry;

      deleteObjectPropertyEntryByKey(
        externalArgs,
        { dataView, allocator },
        hashmapPointer.value,
        "c"
      );

      expect(
        getObjectPropertiesEntries(externalArgs, dataView, hashmapPointer.value)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "a",
            "valuePointer": 200,
          },
          Object {
            "key": "b",
            "valuePointer": 280,
          },
          Object {
            "key": "d",
            "valuePointer": 1,
          },
          Object {
            "key": "e",
            "valuePointer": 472,
          },
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`64`);
    });
  });
});
