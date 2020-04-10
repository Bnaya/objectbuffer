/* eslint-env jest */

import { initializeArrayBuffer } from "./store";

import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { externalArgsApiToExternalArgsApi } from "./utils";
import { makeCarrier } from "./testUtils";

describe("objectWrapper tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({});

  describe("objectWrapper - general", () => {
    test("ObjectWrapper class 1", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);
      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7,
        },
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      const objectWrapper: any = createObjectWrapper(
        externalArgs,
        carrier,
        saverOutput
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

      expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`768`);
    });

    test("ObjectWrapper class 2", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7,
        },
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      const objectWrapper: any = createObjectWrapper(
        externalArgs,
        carrier,
        saverOutput
      );

      expect(objectWrapper.noneExistsProp).toMatchInlineSnapshot(`undefined`);
      expect(objectWrapper.a).toMatchInlineSnapshot(`6`);

      expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`768`);
    });

    test("ObjectWrapper class set override value", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7,
        },
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      const objectWrapper = createObjectWrapper(
        externalArgs,
        carrier,
        saverOutput
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

      expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`800`);
    });

    test("ObjectWrapper class set new prop value", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7,
        },
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      const objectWrapper = createObjectWrapper(
        externalArgs,
        carrier,
        saverOutput
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

      expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`880`);
    });

    test("ObjectWrapper class delete", () => {
      const arrayBuffer = new ArrayBuffer(1024);
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const objectToSave = {
        a: 6,
        kawabanga: null,
        b: "imastringa",
        5: undefined,
        nestedObject: {
          nestedProp: 7,
        },
      };

      const saverOutput = objectSaver(externalArgs, carrier, [], objectToSave);

      const objectWrapper = createObjectWrapper(
        externalArgs,
        carrier,
        saverOutput
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

      expect(carrier.allocator.stats().top).toMatchInlineSnapshot(`768`);
    });
  });
});
