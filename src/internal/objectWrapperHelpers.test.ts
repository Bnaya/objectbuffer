/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { objectSaver } from "./objectSaver";
import {
  findObjectPropertyEntry,
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey,
  findLastObjectPropertyEntry
} from "./objectWrapperHelpers";
import { ExternalArgs } from "./interfaces";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import { MEM_POOL_START } from "./consts";

describe("objectWrapperHelpers tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("objectWrapperHelpers - general", () => {
    test("findObjectPropertyEntry", () => {
      const arrayBuffer = new ArrayBuffer(512);
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
        5: undefined
      };

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      let foundEntry = findObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput,
        "a"
      );

      expect(foundEntry).toMatchInlineSnapshot(`
        Array [
          176,
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 120,
              "value": 152,
            },
          },
        ]
      `);

      foundEntry = findObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput,
        "notfoundkey"
      );

      expect(foundEntry).toMatchInlineSnapshot(`undefined`);
    });

    test("getObjectPropertiesEntries", () => {
      const arrayBuffer = new ArrayBuffer(512);
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

      const gotEntries = getObjectPropertiesEntries(
        externalArgs,
        dataView,
        saverOutput
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "5",
              "next": 280,
              "value": 304,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 224,
              "value": 256,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "kawabanga",
              "next": 184,
              "value": 208,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 112,
              "value": 144,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "nestedObject",
              "next": 0,
              "value": 96,
            },
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

      expect(allocator.stats().available).toMatchInlineSnapshot(`272`);

      deleteObjectPropertyEntryByKey(
        externalArgs,
        { dataView, allocator },
        saverOutput,
        "a"
      );

      expect(allocator.stats().available).toMatchInlineSnapshot(`416`);

      const gotEntries = getObjectPropertiesEntries(
        externalArgs,
        dataView,
        saverOutput
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 96,
              "value": 120,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 56,
              "value": 80,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "d",
              "next": 0,
              "value": 40,
            },
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

      expect(allocator.stats().available).toMatchInlineSnapshot(`272`);

      deleteObjectPropertyEntryByKey(
        externalArgs,
        { dataView, allocator },
        saverOutput,
        "d"
      );

      expect(getObjectPropertiesEntries(externalArgs, dataView, saverOutput))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 160,
              "value": 184,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 96,
              "value": 120,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 80,
            },
          },
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`312`);
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
      expect(allocator.stats().available).toMatchInlineSnapshot(`224`);

      deleteObjectPropertyEntryByKey(
        externalArgs,
        { dataView, allocator },
        saverOutput,
        "c"
      );

      expect(getObjectPropertiesEntries(externalArgs, dataView, saverOutput))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 208,
              "value": 232,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 104,
              "value": 168,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "d",
              "next": 64,
              "value": 88,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "e",
              "next": 0,
              "value": 40,
            },
          },
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`328`);
    });

    test("findLastObjectPropertyEntry - None Empty Object", () => {
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
        c: undefined
      };

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      const found = findLastObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput
      );

      expect(found).toMatchInlineSnapshot(`
        Array [
          56,
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 40,
            },
          },
        ]
      `);

      // this is here for control only
      expect(getObjectPropertiesEntries(externalArgs, dataView, saverOutput))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 120,
              "value": 144,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 56,
              "value": 80,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 40,
            },
          },
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`312`);
    });

    test("findLastObjectPropertyEntryPointer - Empty Object", () => {
      const arrayBuffer = new ArrayBuffer(512);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const objectToSave = {};

      const saverOutput = objectSaver(
        externalArgs,
        { dataView, allocator },
        [],
        objectToSave
      );

      const found = findLastObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput
      );

      expect(found).toMatchInlineSnapshot(`
        Array [
          40,
          Object {
            "refsCount": 1,
            "type": 7,
            "value": 0,
          },
        ]
      `);

      expect(allocator.stats().available).toMatchInlineSnapshot(`464`);
    });
  });
});
