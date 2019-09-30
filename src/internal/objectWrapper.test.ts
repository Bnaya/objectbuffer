/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as utils from "util";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";

describe("objectWrapper tests", () => {
  describe("objectWrapper - general", () => {
    test("ObjectWrapper class 1", () => {
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

      const objectWrapper: any = createObjectWrapper(
        dataView,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      expect(Object.keys(objectWrapper)).toMatchInlineSnapshot(`
        Array [
          "5",
          "a",
          "kawabanga",
          "b",
          "nestedObject",
        ]
      `);

      expect(Object.keys(objectWrapper.nestedObject)).toMatchInlineSnapshot(`
        Array [
          "nestedProp",
        ]
      `);
    });

    test("ObjectWrapper class 2", () => {
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

      const objectWrapper: any = createObjectWrapper(
        dataView,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      expect(objectWrapper.noneExistsProp).toMatchInlineSnapshot(`undefined`);
      expect(objectWrapper.a).toMatchInlineSnapshot(`6`);
    });

    test("ObjectWrapper class set override value", () => {
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

      const objectWrapper = createObjectWrapper(
        dataView,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      objectWrapper.b = "new value";

      expect(objectWrapper).toMatchInlineSnapshot(`
        Object {
          "5": undefined,
          "a": 6,
          "b": "new value",
          "kawabanga": null,
          "nestedObject": Object {
            "nestedProp": 7,
          },
        }
      `);
    });

    test("ObjectWrapper class set new prop value", () => {
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

      const objectWrapper = createObjectWrapper(
        dataView,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      objectWrapper.newprop = "valueOnNewProp";

      expect(objectWrapper).toMatchInlineSnapshot(`
        Object {
          "5": undefined,
          "a": 6,
          "b": "imastringa",
          "kawabanga": null,
          "nestedObject": Object {
            "nestedProp": 7,
          },
          "newprop": "valueOnNewProp",
        }
      `);
    });

    test("ObjectWrapper class delete", () => {
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

      const objectWrapper = createObjectWrapper(
        dataView,
        saverOutput.start,
        textDecoder,
        textEncoder
      );

      delete objectWrapper.b;

      expect(objectWrapper).toMatchInlineSnapshot(`
        Object {
          "5": undefined,
          "a": 6,
          "kawabanga": null,
          "nestedObject": Object {
            "nestedProp": 7,
          },
        }
      `);
    });
  });
});
