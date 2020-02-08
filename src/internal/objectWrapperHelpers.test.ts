/* eslint-env jest */

import { initializeArrayBuffer, readEntry } from "./store";
import * as util from "util";
import { objectSaver } from "./objectSaver";
import {
  getObjectPropertiesEntries,
  deleteObjectPropertyEntryByKey
} from "./objectWrapperHelpers";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { ObjectEntry } from "./interfaces";
import { makeCarrier } from "./testUtils";

describe("objectWrapperHelpers tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  describe("objectWrapperHelpers - general", () => {
    test("getObjectPropertiesEntries", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7
        }
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      const hashmapPointer = (readEntry(carrier, saverOutput) as ObjectEntry)
        .value;

      const gotEntries = getObjectPropertiesEntries(carrier, hashmapPointer);

      expect(gotEntries).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "5",
            "valuePointer": 0,
          },
          Object {
            "key": "a",
            "valuePointer": 272,
          },
          Object {
            "key": "kawabanga",
            "valuePointer": 1,
          },
          Object {
            "key": "b",
            "valuePointer": 432,
          },
          Object {
            "key": "nestedObject",
            "valuePointer": 728,
          },
        ]
      `);
    });
    test("deleteObjectPropertyEntryByKey - delete first one", () => {
      const arrayBuffer = new ArrayBuffer(512);
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`40`);

      const hashmapPointer = (readEntry(carrier, saverOutput) as ObjectEntry)
        .value;

      deleteObjectPropertyEntryByKey(
        externalArgs,
        carrier,
        hashmapPointer,
        "a"
      );

      expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`128`);

      const gotEntries = getObjectPropertiesEntries(carrier, hashmapPointer);

      expect(gotEntries).toMatchInlineSnapshot(`
Array [
  Object {
    "key": "b",
    "valuePointer": 296,
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
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`40`);

      const hashmapPointer = (readEntry(carrier, saverOutput) as ObjectEntry)
        .value;

      deleteObjectPropertyEntryByKey(
        externalArgs,
        carrier,
        hashmapPointer,
        "d"
      );

      expect(getObjectPropertiesEntries(carrier, hashmapPointer))
        .toMatchInlineSnapshot(`
Array [
  Object {
    "key": "a",
    "valuePointer": 208,
  },
  Object {
    "key": "b",
    "valuePointer": 296,
  },
  Object {
    "key": "c",
    "valuePointer": 0,
  },
]
`);

      expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`104`);
    });

    test("deleteObjectPropertyEntryByKey - delete in the middle", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);
      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        b: "imastringa",
        c: undefined,
        d: null,
        e: 66
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);
      // expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`8`);

      const hashmapPointer = readEntry(carrier, saverOutput) as ObjectEntry;

      deleteObjectPropertyEntryByKey(
        externalArgs,
        carrier,
        hashmapPointer.value,
        "c"
      );

      expect(getObjectPropertiesEntries(carrier, hashmapPointer.value))
        .toMatchInlineSnapshot(`
Array [
  Object {
    "key": "a",
    "valuePointer": 208,
  },
  Object {
    "key": "b",
    "valuePointer": 296,
  },
  Object {
    "key": "d",
    "valuePointer": 1,
  },
  Object {
    "key": "e",
    "valuePointer": 520,
  },
]
`);

      // expect(carrier.allocator.stats().available).toMatchInlineSnapshot(`64`);
    });
  });
});
