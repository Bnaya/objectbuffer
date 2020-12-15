/* eslint-env jest */

import {
  createObjectBuffer,
  getUnderlyingArrayBuffer,
  loadObjectBuffer,
} from ".";
import {
  arrayBuffer2HexArray,
  getArrayBufferOnTopSize,
} from "./internal/testUtils";
import { externalArgsApiToExternalArgsApi } from "./internal/utils";
import { ENDIANNESS_FLAG_POINTER, ENDIANNESS } from "./internal/consts";

describe("createObjectBuffer", () => {
  test("createObjectBuffer simple", () => {
    const o = createObjectBuffer(1024, {
      a: "b",
      b: null,
      c: { t: 5 },
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
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 0,
  });
  test("getUnderlyingArrayBuffer simple", () => {
    const o = createObjectBuffer(
      1024,
      {
        b: null,
        c: { t: 5 },
      },
      externalArgs
    );

    const arrayBuffer = getUnderlyingArrayBuffer(o);

    expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);

    // that one tests implementation details, but...
    expect(
      arrayBuffer2HexArray(getArrayBufferOnTopSize(o), true)
    ).toMatchSnapshot();
  });
});

describe("loadObjectBuffer", () => {
  test("loadObjectBuffer simple", () => {
    const o = createObjectBuffer(1024, {
      a: "b",
      b: null,
      c: { t: 5 },
    });

    const arrayBuffer = getUnderlyingArrayBuffer(o);

    const dv = new DataView(arrayBuffer);

    const realEndianness = dv.getUint32(ENDIANNESS_FLAG_POINTER, true);
    // flip Endianness
    dv.setUint32(
      ENDIANNESS_FLAG_POINTER,
      realEndianness === ENDIANNESS.BIG ? ENDIANNESS.LITTLE : ENDIANNESS.BIG,
      true
    );

    expect(() => {
      return loadObjectBuffer(arrayBuffer);
    }).toThrowErrorMatchingInlineSnapshot(`"Endianness mismatch"`);
  });

  test("Endianness miss match", () => {
    const o = createObjectBuffer(1024, {
      a: "b",
      b: null,
      c: { t: 5 },
    });

    const arrayBuffer = getUnderlyingArrayBuffer(o);

    const newOne = loadObjectBuffer(arrayBuffer);

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
