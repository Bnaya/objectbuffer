/* eslint-env jest */

import {
  writeEntry,
  initializeArrayBuffer,
  readEntry,
  appendEntry,
} from "./store";
import { ENTRY_TYPE } from "./entry-types";

import { arrayBuffer2HexArray, makeCarrier } from "./testUtils";
import { ObjectEntry } from "./interfaces";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("Store tests - Misc", () => {
  test("initializeArrayBuffer", () => {
    const arrayBuffer = new ArrayBuffer(64);

    initializeArrayBuffer(arrayBuffer);
    expect(arrayBuffer2HexArray(arrayBuffer.slice(0, 20), true))
      .toMatchInlineSnapshot(`
      Array [
        "0:0x00",
        "1:0x00",
        "2:0x00",
        "3:0x00",
        "4:0x08",
        "5:0x00",
        "6:0x00",
        "7:0x00",
        "8:0x00",
        "9:0x00",
        "10:0x00",
        "11:0x00",
        "12:0x00",
        "13:0x00",
        "14:0x00",
        "15:0x00",
        "16:0x00",
        "17:0x00",
        "18:0x00",
        "19:0x00",
      ]
    `);
  });
});

describe("Store tests writeEntry", () => {
  test("writeEntry max number", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MAX_VALUE,
    });

    expect(arrayBuffer2HexArray(arrayBuffer.slice(0, 17)))
      .toMatchInlineSnapshot(`
      Array [
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x40",
        "0xff",
      ]
    `);
  });
  test("writeEntry min number", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MIN_VALUE,
    });

    expect(arrayBuffer2HexArray(arrayBuffer.slice(0, 17)))
      .toMatchInlineSnapshot(`
Array [
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x40",
  "0x01",
]
`);
  });

  test("writeEntry string", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 8, {
      type: ENTRY_TYPE.STRING,
      value: "aא弟",
      allocatedBytes: 6,
    });

    expect(arrayBuffer2HexArray(arrayBuffer.slice(0, 19)))
      .toMatchInlineSnapshot(`
Array [
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x00",
  "0x14",
  "0x40",
  "0x06",
  "0x00",
  "0x00",
]
`);
  });
});

describe("Store tests readEntry", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    arrayAdditionalAllocation: 20,
  });

  test("readEntry max number", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MAX_VALUE,
    });

    const redEntry = readEntry(carrier, 8);

    // expect(redBytesLength).toBe(writtenLength);

    expect(redEntry).toMatchInlineSnapshot(`
      Object {
        "type": 2,
        "value": 1.7976931348623157e+308,
      }
    `);
  });

  test("readEntry min number", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MIN_VALUE,
    });

    const redEntry = readEntry(carrier, 8);

    expect(redEntry).toMatchInlineSnapshot(`
      Object {
        "type": 2,
        "value": 5e-324,
      }
    `);
  });

  test("readEntry string", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 0, {
      type: ENTRY_TYPE.STRING,
      value: "aא弟",
      allocatedBytes: 6,
    });

    const entry = readEntry(carrier, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "allocatedBytes": 6,
        "type": 5,
        "value": "aא弟",
      }
    `);
  });

  test("readEntry BigInt", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 0, {
      type: ENTRY_TYPE.BIGINT_POSITIVE,
      value: BigInt("0b0" + "1".repeat(63)),
    });

    const entry = readEntry(carrier, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 9223372036854775807n,
      }
    `);
  });

  test("readEntry UBigInt", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 0, {
      type: ENTRY_TYPE.BIGINT_POSITIVE,
      value: BigInt("0b" + "1".repeat(64)),
    });

    const entry = readEntry(carrier, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 18446744073709551615n,
      }
    `);
  });
  test("ENTRY_TYPE.BIGINT_POSITIVE max value", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 0, {
      type: ENTRY_TYPE.BIGINT_POSITIVE,
      value: BigInt("0b" + "1".repeat(64)),
    });

    expect(readEntry(carrier, 0)).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 18446744073709551615n,
      }
    `);
  });

  test("ENTRY_TYPE.BIGINT_NEGATIVE min value", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    writeEntry(carrier, 0, {
      type: ENTRY_TYPE.BIGINT_NEGATIVE,
      value: -BigInt("0b" + "1".repeat(64)),
    });

    expect(readEntry(carrier, 0)).toMatchInlineSnapshot(`
      Object {
        "type": 4,
        "value": -18446744073709551615n,
      }
    `);
  });

  test("BigInt64 overflow error", () => {
    const arrayBuffer = new ArrayBuffer(64);
    const carrier = makeCarrier(arrayBuffer);

    expect(() => {
      writeEntry(carrier, 0, {
        type: ENTRY_TYPE.BIGINT_POSITIVE,
        value: BigInt("0b" + "1".repeat(65)),
      });
    }).toThrowErrorMatchingInlineSnapshot(`"BigInt64OverflowError"`);
  });

  describe("Store tests write/read entry", () => {
    test("object entry", () => {
      const arrayBuffer = new ArrayBuffer(64);
      const carrier = makeCarrier(arrayBuffer);

      const entryToWrite: ObjectEntry = {
        type: ENTRY_TYPE.OBJECT,
        refsCount: 0,
        value: 10,
      };

      writeEntry(carrier, 0, entryToWrite);

      const entry = readEntry(carrier, 0);

      expect(entry).toMatchInlineSnapshot(`
        Object {
          "refsCount": 0,
          "type": 7,
          "value": 10,
        }
      `);
    });
  });

  describe("appendEntry - general", () => {
    test("appendEntry", () => {
      const arrayBuffer = new ArrayBuffer(96);
      initializeArrayBuffer(arrayBuffer);

      const carrier = makeCarrier(arrayBuffer);

      const r1 = appendEntry(externalArgs, carrier, {
        type: ENTRY_TYPE.STRING,
        value: "im a string",
        allocatedBytes: 11,
      });

      expect(r1).toMatchInlineSnapshot(`48`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
Array [
  "0:0x00",
  "1:0x00",
  "2:0x00",
  "3:0x00",
  "4:0x08",
  "5:0x00",
  "6:0x00",
  "7:0x00",
  "8:0x00",
  "9:0x00",
  "10:0x00",
  "11:0x00",
  "12:0x00",
  "13:0x00",
  "14:0x00",
  "15:0x00",
  "16:0x28",
  "17:0x00",
  "18:0x00",
  "19:0x00",
  "20:0x48",
  "21:0x00",
  "22:0x00",
  "23:0x00",
  "24:0x60",
  "25:0x00",
  "26:0x00",
  "27:0x00",
  "28:0x08",
  "29:0x00",
  "30:0x00",
  "31:0x00",
  "32:0x03",
  "33:0x00",
  "34:0x00",
  "35:0x00",
  "36:0x10",
  "37:0x00",
  "38:0x00",
  "39:0x00",
  "40:0x20",
  "41:0x00",
  "42:0x00",
  "43:0x00",
  "44:0x00",
  "45:0x00",
  "46:0x00",
  "47:0x00",
  "48:0x00",
  "49:0x00",
  "50:0x00",
  "51:0x00",
  "52:0x00",
  "53:0x00",
  "54:0x14",
  "55:0x40",
  "56:0x0b",
  "57:0x00",
  "58:0x00",
  "59:0x00",
  "60:0x69",
  "61:0x6d",
  "62:0x20",
  "63:0x61",
  "64:0x20",
  "65:0x73",
  "66:0x74",
  "67:0x72",
  "68:0x69",
  "69:0x6e",
  "70:0x67",
  "71:0x00",
  "72:0x00",
  "73:0x00",
  "74:0x00",
  "75:0x00",
  "76:0x00",
  "77:0x00",
  "78:0x00",
  "79:0x00",
  "80:0x00",
  "81:0x00",
  "82:0x00",
  "83:0x00",
  "84:0x00",
  "85:0x00",
  "86:0x00",
  "87:0x00",
  "88:0x00",
  "89:0x00",
  "90:0x00",
  "91:0x00",
  "92:0x00",
  "93:0x00",
  "94:0x00",
  "95:0x00",
]
`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
Array [
  "0:0x00",
  "1:0x00",
  "2:0x00",
  "3:0x00",
  "4:0x08",
  "5:0x00",
  "6:0x00",
  "7:0x00",
  "8:0x00",
  "9:0x00",
  "10:0x00",
  "11:0x00",
  "12:0x00",
  "13:0x00",
  "14:0x00",
  "15:0x00",
  "16:0x28",
  "17:0x00",
  "18:0x00",
  "19:0x00",
  "20:0x48",
  "21:0x00",
  "22:0x00",
  "23:0x00",
  "24:0x60",
  "25:0x00",
  "26:0x00",
  "27:0x00",
  "28:0x08",
  "29:0x00",
  "30:0x00",
  "31:0x00",
  "32:0x03",
  "33:0x00",
  "34:0x00",
  "35:0x00",
  "36:0x10",
  "37:0x00",
  "38:0x00",
  "39:0x00",
  "40:0x20",
  "41:0x00",
  "42:0x00",
  "43:0x00",
  "44:0x00",
  "45:0x00",
  "46:0x00",
  "47:0x00",
  "48:0x00",
  "49:0x00",
  "50:0x00",
  "51:0x00",
  "52:0x00",
  "53:0x00",
  "54:0x14",
  "55:0x40",
  "56:0x0b",
  "57:0x00",
  "58:0x00",
  "59:0x00",
  "60:0x69",
  "61:0x6d",
  "62:0x20",
  "63:0x61",
  "64:0x20",
  "65:0x73",
  "66:0x74",
  "67:0x72",
  "68:0x69",
  "69:0x6e",
  "70:0x67",
  "71:0x00",
  "72:0x00",
  "73:0x00",
  "74:0x00",
  "75:0x00",
  "76:0x00",
  "77:0x00",
  "78:0x00",
  "79:0x00",
  "80:0x00",
  "81:0x00",
  "82:0x00",
  "83:0x00",
  "84:0x00",
  "85:0x00",
  "86:0x00",
  "87:0x00",
  "88:0x00",
  "89:0x00",
  "90:0x00",
  "91:0x00",
  "92:0x00",
  "93:0x00",
  "94:0x00",
  "95:0x00",
]
`);
    });
  });
});
