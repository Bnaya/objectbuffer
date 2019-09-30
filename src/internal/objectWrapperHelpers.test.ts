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
        getObjectPropertiesEntries(dataView, saverOutput.start, textDecoder)
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
          24,
          Object {
            "type": 7,
            "value": 0,
          },
        ]
      `);
    });
  });
});
