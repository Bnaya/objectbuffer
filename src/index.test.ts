/* eslint-env jest */
import * as util from "util";

const textEncoder = new util.TextEncoder();
const textDecoder = new util.TextDecoder();

import {
  createObjectBuffer,
  getUnderlyingArrayBuffer,
  createObjectBufferFromArrayBuffer
} from ".";
import { arrayBuffer2HexArray } from "./internal/testUtils";

describe("createObjectBuffer", () => {
  test("createObjectBuffer simple", () => {
    const o = createObjectBuffer(textDecoder, textEncoder, 128, {
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
  test("getUnderlyingArrayBuffer simple", () => {
    const o = createObjectBuffer(textDecoder, textEncoder, 80, {
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
  test("createObjectBufferFromArrayBuffer simple", () => {
    const o = createObjectBuffer(textDecoder, textEncoder, 128, {
      a: "b",
      b: null,
      c: { t: 5 }
    });

    const arrayBuffer = getUnderlyingArrayBuffer(o);

    const newOne = createObjectBufferFromArrayBuffer(
      textDecoder,
      textEncoder,
      arrayBuffer
    );

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
