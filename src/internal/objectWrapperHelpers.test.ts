/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { objectSaver } from "./objectSaver";
import {
  findObjectPropertyEntry,
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey,
  findLastObjectPropertyEntry
} from "./objectWrapperHelpers";

describe("objectWrapperHelpers tests", () => {
  describe("objectWrapperHelpers - general", () => {
    test("findObjectPropertyEntry", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined
      };

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      let foundEntry = findObjectPropertyEntry(
        dataView,
        saverOutput.start,
        "a",
        textDecoder
      );

      expect(foundEntry).toMatchInlineSnapshot(`
        Array [
          71,
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 42,
              "value": 62,
            },
          },
        ]
      `);

      foundEntry = findObjectPropertyEntry(
        dataView,
        saverOutput.start,
        "notfoundkey",
        textDecoder
      );

      expect(foundEntry).toMatchInlineSnapshot(`undefined`);
    });

    test("getObjectPropertiesEntries", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
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

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      const gotEntries = getObjectPropertiesEntries(
        dataView,
        saverOutput.start,
        textDecoder
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "5",
              "next": 129,
              "value": 141,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 100,
              "value": 120,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "kawabanga",
              "next": 87,
              "value": 99,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 51,
              "value": 74,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "nestedObject",
              "next": 0,
              "value": 46,
            },
          },
        ]
      `);
    });
    test("deleteObjectPropertyEntryByKey - delete first one", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      deleteObjectPropertyEntryByKey(
        dataView,
        textDecoder,
        textEncoder,
        saverOutput.start,
        "a"
      );

      const gotEntries = getObjectPropertiesEntries(
        dataView,
        saverOutput.start,
        textDecoder
      );

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 30,
              "value": 42,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 17,
              "value": 29,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "d",
              "next": 0,
              "value": 16,
            },
          },
        ]
      `);
    });

    test("deleteObjectPropertyEntryByKey - delete last one", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      deleteObjectPropertyEntryByKey(
        dataView,
        textDecoder,
        textEncoder,
        saverOutput.start,
        "d"
      );

      expect(
        getObjectPropertiesEntries(dataView, saverOutput.start, textDecoder)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 55,
              "value": 67,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 30,
              "value": 42,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 29,
            },
          },
        ]
      `);
    });

    test("deleteObjectPropertyEntryByKey - delete in the middle", () => {
      const arrayBuffer = new ArrayBuffer(256);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null,
        e: 66
      };

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      deleteObjectPropertyEntryByKey(
        dataView,
        textDecoder,
        textEncoder,
        saverOutput.start,
        "c"
      );

      expect(
        getObjectPropertiesEntries(dataView, saverOutput.start, textDecoder)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 76,
              "value": 88,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 38,
              "value": 63,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "d",
              "next": 25,
              "value": 37,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "e",
              "next": 0,
              "value": 16,
            },
          },
        ]
      `);
    });

    test("findLastObjectPropertyEntry - None Empty Object", () => {
      const arrayBuffer = new ArrayBuffer(128);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined
      };

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      const found = findLastObjectPropertyEntry(
        dataView,
        saverOutput.start,
        textDecoder
      );

      expect(found).toMatchInlineSnapshot(`
        Array [
          17,
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 16,
            },
          },
        ]
      `);

      // this is here for control only
      expect(
        getObjectPropertiesEntries(dataView, saverOutput.start, textDecoder)
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "type": 8,
            "value": Object {
              "key": "a",
              "next": 42,
              "value": 54,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "b",
              "next": 17,
              "value": 29,
            },
          },
          Object {
            "type": 8,
            "value": Object {
              "key": "c",
              "next": 0,
              "value": 16,
            },
          },
        ]
      `);
    });

    test("findLastObjectPropertyEntryPointer - Empty Object", () => {
      const arrayBuffer = new ArrayBuffer(64);
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const objectToSave = {};

      const saverOutput = objectSaver(textEncoder, dataView, 0, objectToSave);

      const found = findLastObjectPropertyEntry(
        dataView,
        saverOutput.start,
        textDecoder
      );

      expect(found).toMatchInlineSnapshot(`
        Array [
          16,
          Object {
            "type": 7,
            "value": 0,
          },
        ]
      `);
    });
  });
});
