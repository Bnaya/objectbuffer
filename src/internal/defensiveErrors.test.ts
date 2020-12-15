import { createObjectBuffer } from "..";
import { externalArgsApiToExternalArgsApi } from "./utils";

/* eslint-env jest */

describe("defensiveErrors", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  test("defensiveErrors Date", () => {
    const objectBuffer = createObjectBuffer(
      1024,
      {
        date: new Date(0),
        array: [1],
        object: {},
      },
      externalArgs
    );

    expect(() => {
      (objectBuffer.date as any)[5] = "a";
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);
    expect(() => {
      (objectBuffer.date as any)["bla"] = "a";
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);
    expect(() => {
      (objectBuffer.date as any)[Symbol("bla")] = "a";
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);

    expect(() => {
      Object.defineProperty(objectBuffer.date, "propy", {
        enumerable: true,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);

    expect(() => {
      Object.setPrototypeOf(objectBuffer.date, {});
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "array": Array [
          1,
        ],
        "date": "1970-01-01T00:00:00.000Z",
        "object": Object {},
      }
    `);
  });

  test("defensiveErrors Array", () => {
    const objectBuffer = createObjectBuffer(
      1024,
      {
        date: new Date(0),
        array: [1],
        object: {},
      },
      externalArgs
    );

    expect(() => {
      objectBuffer.array[-5] = 5;
    }).toThrowErrorMatchingInlineSnapshot(`"IllegalArrayIndexError"`);
    expect(() => {
      (objectBuffer.array as any)["bla"] = "a";
    }).toThrowErrorMatchingInlineSnapshot(`"IllegalArrayIndexError"`);
    expect(() => {
      (objectBuffer.array as any)[Symbol("bla")] = "a";
    }).toThrowErrorMatchingInlineSnapshot(`"IllegalArrayIndexError"`);

    expect(() => {
      Object.setPrototypeOf(objectBuffer.array, {});
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "array": Array [
          1,
        ],
        "date": "1970-01-01T00:00:00.000Z",
        "object": Object {},
      }
    `);
  });

  test("defensiveErrors Object", () => {
    const objectBuffer = createObjectBuffer(
      1024,
      {
        date: new Date(0),
        array: [1],
        object: {},
      },
      externalArgs
    );

    expect(() => {
      Object.defineProperty(objectBuffer.object, "newProp", {
        configurable: false,
        enumerable: false,
      });
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);

    expect(() => {
      (objectBuffer.object as any)[Symbol("bla")] = "a";
    }).toThrowErrorMatchingInlineSnapshot(`"IllegalObjectPropConfigError"`);

    expect(() => {
      Object.setPrototypeOf(objectBuffer.object, {});
    }).toThrowErrorMatchingInlineSnapshot(`"UnsupportedOperationError"`);

    expect(objectBuffer).toMatchInlineSnapshot(`
      Object {
        "array": Array [
          1,
        ],
        "date": "1970-01-01T00:00:00.000Z",
        "object": Object {},
      }
    `);
  });
});
