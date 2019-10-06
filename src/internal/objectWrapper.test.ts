/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { getFirstFreeByte } from "./testUtils";
import { ExternalArgs } from "./interfaces";

describe("objectWrapper tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  describe("objectWrapper - general", () => {
    test("ObjectWrapper class 1", () => {
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

      const objectWrapper: any = createObjectWrapper(
        externalArgs,
        { dataView },
        saverOutput.start
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

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`179`);
    });

    test("ObjectWrapper class 2", () => {
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

      const objectWrapper: any = createObjectWrapper(
        externalArgs,
        { dataView },
        saverOutput.start
      );

      expect(objectWrapper.noneExistsProp).toMatchInlineSnapshot(`undefined`);
      expect(objectWrapper.a).toMatchInlineSnapshot(`6`);

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`179`);
    });

    test("ObjectWrapper class set override value", () => {
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

      const objectWrapper = createObjectWrapper(
        externalArgs,
        { dataView },
        saverOutput.start
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

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`179`);
    });

    test("ObjectWrapper class set new prop value", () => {
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

      const objectWrapper = createObjectWrapper(
        externalArgs,
        { dataView },
        saverOutput.start
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

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`230`);
    });

    test("ObjectWrapper class delete", () => {
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

      const objectWrapper = createObjectWrapper(
        externalArgs,
        { dataView },
        saverOutput.start
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

      expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`179`);
    });
  });
});
