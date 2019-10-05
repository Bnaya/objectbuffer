/* eslint-env jest */
import * as util from "util";

import {
  createObjectBuffer,
  getUnderlyingArrayBuffer,
  createObjectBufferFromArrayBuffer,
  ExternalArgs
} from ".";
import { arrayBuffer2HexArray } from "./internal/testUtils";

describe("createObjectBuffer", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("createObjectBuffer simple", () => {
    const o = createObjectBuffer(externalArgs, 128, {
      a: "b",
      b: null,
      c: { t: 5 }
    });

    expect(o).toMatchInlineSnapshot(`
      Object {
        "a": "b",
        "b": null,
        "c": Object {
          "t": 5,
        },
      }
    `);
  });
});

describe("getUnderlyingArrayBuffer", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };
  test("getUnderlyingArrayBuffer simple", () => {
    const o = createObjectBuffer(externalArgs, 80, {
      b: null,
      c: { t: 5 }
    });

    const arrayBuffer = getUnderlyingArrayBuffer(o);

    expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);

    // that one tests implementation details, but...
    expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchSnapshot();
  });
});

describe("createObjectBufferFromArrayBuffer", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("createObjectBufferFromArrayBuffer simple", () => {
    const o = createObjectBuffer(externalArgs, 128, {
      a: "b",
      b: null,
      c: { t: 5 }
    });

    const arrayBuffer = getUnderlyingArrayBuffer(o);

    const newOne = createObjectBufferFromArrayBuffer(externalArgs, arrayBuffer);

    expect(o).toMatchInlineSnapshot(`
      Object {
        "a": "b",
        "b": null,
        "c": Object {
          "t": 5,
        },
      }
    `);

    expect(newOne).toMatchInlineSnapshot(`
      Object {
        "a": "b",
        "b": null,
        "c": Object {
          "t": 5,
        },
      }
    `);
  });
});
