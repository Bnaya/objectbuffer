/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { objectSaver } from "./objectSaver";
import { createObjectWrapper } from "./objectWrapper";
import { MEM_POOL_START } from "./consts";
import { MemPool } from "@thi.ng/malloc";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("objectWrapper tests", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder()
  });

  describe("objectWrapper - general", () => {
    test("ObjectWrapper class 1", () => {
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

      const objectWrapper: any = createObjectWrapper(
        externalArgs,
        { dataView, allocator },
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

      expect(allocator.stats().top).toMatchInlineSnapshot(`736`);
    });

    test("ObjectWrapper class 2", () => {
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

      const objectWrapper: any = createObjectWrapper(
        externalArgs,
        { dataView, allocator },
        saverOutput
      );

      expect(objectWrapper.noneExistsProp).toMatchInlineSnapshot(`undefined`);
      expect(objectWrapper.a).toMatchInlineSnapshot(`6`);

      expect(allocator.stats().top).toMatchInlineSnapshot(`736`);
    });

    test("ObjectWrapper class set override value", () => {
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

      const objectWrapper = createObjectWrapper(
        externalArgs,
        { dataView, allocator },
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

      expect(allocator.stats().top).toMatchInlineSnapshot(`736`);
    });

    test("ObjectWrapper class set new prop value", () => {
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

      const objectWrapper = createObjectWrapper(
        externalArgs,
        { dataView, allocator },
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

      expect(allocator.stats().top).toMatchInlineSnapshot(`832`);
    });

    test("ObjectWrapper class delete", () => {
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

      const objectWrapper = createObjectWrapper(
        externalArgs,
        { dataView, allocator },
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

      expect(allocator.stats().top).toMatchInlineSnapshot(`736`);
    });
  });
});
