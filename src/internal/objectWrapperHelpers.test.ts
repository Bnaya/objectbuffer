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
import { getFirstFreeByte } from "./testUtils";
import { ExternalArgs } from "./interfaces";

describe("objectWrapperHelpers tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("objectWrapperHelpers - general", () => {
    test("findObjectPropertyEntry", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined
      };

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      let foundEntry = findObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput.start,
        "a"
      );

      expect(foundEntry).toMatchInlineSnapshot(`
        Array [
          79,
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 50,
              "value": 70,
            },
          },
        ]
      `);

      foundEntry = findObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput.start,
        "notfoundkey"
      );

      expect(foundEntry).toMatchInlineSnapshot(`undefined`);
    });

    test("getObjectPropertiesEntries", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7
        }
      };

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      const gotEntries = getObjectPropertiesEntries(
        externalArgs,
        dataView,
        saverOutput.start
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "5",
              "next": 137,
              "value": 149,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 108,
              "value": 128,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "kawabanga",
              "next": 95,
              "value": 107,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 59,
              "value": 82,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "nestedObject",
              "next": 0,
              "value": 54,
            },
          },
        ]
      `);
    });
    test("deleteObjectPropertyEntryByKey - delete first one", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      deleteObjectPropertyEntryByKey(
        externalArgs,
        dataView,
        saverOutput.start,
        "a"
      );

      const gotEntries = getObjectPropertiesEntries(
        externalArgs,
        dataView,
        saverOutput.start
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 38,
              "value": 50,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 25,
              "value": 37,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "d",
              "next": 0,
              "value": 24,
            },
          },
        ]
      `);
    });

    test("deleteObjectPropertyEntryByKey - delete last one", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      deleteObjectPropertyEntryByKey(
        externalArgs,
        dataView,
        saverOutput.start,
        "d"
      );

      expect(
        getObjectPropertiesEntries(externalArgs, dataView, saverOutput.start)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 63,
              "value": 75,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 38,
              "value": 50,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 37,
            },
          },
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`101`);
    });

    test("deleteObjectPropertyEntryByKey - delete in the middle", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null,
        e: 66
      };

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      deleteObjectPropertyEntryByKey(
        externalArgs,
        dataView,
        saverOutput.start,
        "c"
      );

      expect(
        getObjectPropertiesEntries(externalArgs, dataView, saverOutput.start)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 84,
              "value": 96,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 46,
              "value": 71,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "d",
              "next": 33,
              "value": 45,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "e",
              "next": 0,
              "value": 24,
            },
          },
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`122`);
    });

    test("findLastObjectPropertyEntry - None Empty Object", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined
      };

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      const found = findLastObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput.start
      );

      expect(found).toMatchInlineSnapshot(`
        Array [
          25,
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 24,
            },
          },
        ]
      `);

      // this is here for control only
      expect(
        getObjectPropertiesEntries(externalArgs, dataView, saverOutput.start)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 50,
              "value": 62,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 25,
              "value": 37,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 24,
            },
          },
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`88`);
    });

    test("findLastObjectPropertyEntryPointer - Empty Object", () => {
      const arrayBuffer = new ArrayBuffer(64);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {};

      const saverOutput = objectSaver(externalArgs, dataView, objectToSave);

      const found = findLastObjectPropertyEntry(
        externalArgs,
        dataView,
        saverOutput.start
      );

      expect(found).toMatchInlineSnapshot(`
        Array [
          24,
          Object {
            "type": 7,
            "value": 0,
          },
        ]
      `);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`29`);
    });
  });
});
