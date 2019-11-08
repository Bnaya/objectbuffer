/* eslint-env jest */

import {
  writeEntry,
  initializeArrayBuffer,
  readEntry,
  appendEntry
} from "./store";
import { ENTRY_TYPE } from "./entry-types";
import * as util from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { ObjectEntry, ObjectPropEntry, ExternalArgs } from "./interfaces";
import { MemPool } from "@bnaya/malloc-temporary-fork";
import { MEM_POOL_START } from "./consts";
import { externalArgsApiToExternalArgsApi } from "./utils";

describe("Store tests - Misc", () => {
  test("initializeArrayBuffer", () => {
    const arrayBuffer = new ArrayBuffer(20);

    initializeArrayBuffer(arrayBuffer);
    expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
      Array [
        "0:0x00",
        "1:0x00",
        "2:0x00",
        "3:0x00",
        "4:0x00",
        "5:0x00",
        "6:0x00",
        "7:0x08",
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
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  test("writeEntry max number", () => {
    const externalArgs: ExternalArgs = externalArgsApiToExternalArgsApi({
      textEncoder: new util.TextEncoder(),
      textDecoder: new util.TextDecoder(),
      arrayAdditionalAllocation: 0,
      minimumStringAllocation: 0
    });

    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MAX_VALUE
    });

    expect(arrayBuffer2HexArray(arrayBuffer)).toMatchInlineSnapshot(`
      Array [
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x02",
        "0x7f",
        "0xef",
        "0xff",
        "0xff",
        "0xff",
        "0xff",
        "0xff",
        "0xff",
      ]
    `);
  });
  test("writeEntry min number", () => {
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MIN_VALUE
    });

    expect(arrayBuffer2HexArray(arrayBuffer)).toMatchInlineSnapshot(`
      Array [
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x02",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x01",
      ]
    `);
  });

  test("writeEntry string", () => {
    const arrayBuffer = new ArrayBuffer(19);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.STRING,
      value: "aא弟",
      allocatedBytes: 0
    });

    expect(arrayBuffer2HexArray(arrayBuffer)).toMatchInlineSnapshot(`
      Array [
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x00",
        "0x05",
        "0x00",
        "0x06",
        "0x00",
        "0x00",
        "0x61",
        "0xd7",
        "0x90",
        "0xe5",
        "0xbc",
        "0x9f",
      ]
    `);
  });
});

describe("Store tests readEntry", () => {
  const externalArgs = externalArgsApiToExternalArgsApi({
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 20
  });

  test("readEntry max number", () => {
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MAX_VALUE
    });

    const redEntry = readEntry(externalArgs, dataView, 8);

    // expect(redBytesLength).toBe(writtenLength);

    expect(redEntry).toMatchInlineSnapshot(`
      Object {
        "type": 2,
        "value": 1.7976931348623157e+308,
      }
    `);
  });

  test("readEntry min number", () => {
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MIN_VALUE
    });

    const redEntry = readEntry(externalArgs, dataView, 8);

    expect(redEntry).toMatchInlineSnapshot(`
      Object {
        "type": 2,
        "value": 5e-324,
      }
    `);
  });

  test("readEntry string", () => {
    const arrayBuffer = new ArrayBuffer(12);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.STRING,
      value: "aא弟",
      allocatedBytes: 0
    });

    const entry = readEntry(externalArgs, dataView, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "allocatedBytes": 0,
        "type": 5,
        "value": "aא弟",
      }
    `);
  });

  test("readEntry BigInt", () => {
    const arrayBuffer = new ArrayBuffer(20);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.BIGINT_POSITIVE,
      value: BigInt("0b0" + "1".repeat(63))
    });

    const entry = readEntry(externalArgs, dataView, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 9223372036854775807n,
      }
    `);
  });

  test("readEntry UBigInt", () => {
    const arrayBuffer = new ArrayBuffer(16);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.BIGINT_POSITIVE,
      value: BigInt("0b" + "1".repeat(64))
    });

    const entry = readEntry(externalArgs, dataView, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 18446744073709551615n,
      }
    `);
  });
  test("ENTRY_TYPE.BIGINT_POSITIVE max value", () => {
    const arrayBuffer = new ArrayBuffer(16);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.BIGINT_POSITIVE,
      value: BigInt("0b" + "1".repeat(64))
    });

    expect(readEntry(externalArgs, dataView, 0)).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 18446744073709551615n,
      }
    `);
  });

  test("ENTRY_TYPE.BIGINT_NEGATIVE min value", () => {
    const arrayBuffer = new ArrayBuffer(16);
    const dataView = new DataView(arrayBuffer);

    writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.BIGINT_NEGATIVE,
      value: -BigInt("0b" + "1".repeat(64))
    });

    expect(readEntry(externalArgs, dataView, 0)).toMatchInlineSnapshot(`
      Object {
        "type": 4,
        "value": -18446744073709551615n,
      }
    `);
  });

  test("BigInt64 overflow error", () => {
    const arrayBuffer = new ArrayBuffer(16);
    const dataView = new DataView(arrayBuffer);

    expect(() => {
      writeEntry(externalArgs, dataView, 0, {
        type: ENTRY_TYPE.BIGINT_POSITIVE,
        value: BigInt("0b" + "1".repeat(65))
      });
    }).toThrowErrorMatchingInlineSnapshot(`"BigInt64OverflowError"`);
  });

  describe("Store tests write/read entry", () => {
    test("object entry", () => {
      const arrayBuffer = new ArrayBuffer(8);
      const dataView = new DataView(arrayBuffer);

      const entryToWrite: ObjectEntry = {
        type: ENTRY_TYPE.OBJECT,
        refsCount: 0,
        value: 10
      };

      writeEntry(externalArgs, dataView, 0, entryToWrite);

      const entry = readEntry(externalArgs, dataView, 0);

      expect(entry).toMatchInlineSnapshot(`
        Object {
          "refsCount": 0,
          "type": 7,
          "value": 10,
        }
      `);
    });
  });

  test("object property entry", () => {
    const arrayBuffer = new ArrayBuffer(32);
    const dataView = new DataView(arrayBuffer);

    const entryToWrite: ObjectPropEntry = {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        key: "imapropkey",
        value: 0xff,
        next: 0xffff
      }
    };

    writeEntry(externalArgs, dataView, 0, entryToWrite);

    const entry = readEntry(externalArgs, dataView, 0);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 8,
        "value": Object {
          "key": "imapropkey",
          "next": 65535,
          "value": 255,
        },
      }
    `);
  });

  describe("appendEntry - general", () => {
    test("appendEntry", () => {
      const arrayBuffer = new ArrayBuffer(100);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);
      const allocator = new MemPool({
        buf: arrayBuffer,
        start: MEM_POOL_START
      });

      const r1 = appendEntry(
        externalArgs,
        { dataView, allocator },
        {
          type: ENTRY_TYPE.STRING,
          value: "im a string",
          allocatedBytes: 0
        }
      );

      expect(r1).toMatchInlineSnapshot(`40`);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
        Array [
          "0:0x00",
          "1:0x00",
          "2:0x00",
          "3:0x00",
          "4:0x00",
          "5:0x00",
          "6:0x00",
          "7:0x08",
          "8:0x00",
          "9:0x00",
          "10:0x00",
          "11:0x00",
          "12:0x00",
          "13:0x00",
          "14:0x00",
          "15:0x00",
          "16:0x38",
          "17:0x00",
          "18:0x00",
          "19:0x00",
          "20:0x64",
          "21:0x00",
          "22:0x00",
          "23:0x00",
          "24:0x00",
          "25:0x00",
          "26:0x00",
          "27:0x00",
          "28:0x20",
          "29:0x00",
          "30:0x00",
          "31:0x00",
          "32:0x18",
          "33:0x00",
          "34:0x00",
          "35:0x00",
          "36:0x00",
          "37:0x00",
          "38:0x00",
          "39:0x00",
          "40:0x05",
          "41:0x00",
          "42:0x0b",
          "43:0x00",
          "44:0x00",
          "45:0x69",
          "46:0x6d",
          "47:0x20",
          "48:0x61",
          "49:0x20",
          "50:0x73",
          "51:0x74",
          "52:0x72",
          "53:0x69",
          "54:0x6e",
          "55:0x67",
          "56:0x00",
          "57:0x00",
          "58:0x00",
          "59:0x00",
          "60:0x00",
          "61:0x00",
          "62:0x00",
          "63:0x00",
          "64:0x00",
          "65:0x00",
          "66:0x00",
          "67:0x00",
          "68:0x00",
          "69:0x00",
          "70:0x00",
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
          "96:0x00",
          "97:0x00",
          "98:0x00",
          "99:0x00",
        ]
      `);

      const r2 = appendEntry(
        externalArgs,
        { dataView, allocator },
        {
          type: ENTRY_TYPE.BOOLEAN,
          value: true
        }
      );

      expect(r2).toMatchInlineSnapshot(`64`);
      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
        Array [
          "0:0x00",
          "1:0x00",
          "2:0x00",
          "3:0x00",
          "4:0x00",
          "5:0x00",
          "6:0x00",
          "7:0x08",
          "8:0x00",
          "9:0x00",
          "10:0x00",
          "11:0x00",
          "12:0x00",
          "13:0x00",
          "14:0x00",
          "15:0x00",
          "16:0x48",
          "17:0x00",
          "18:0x00",
          "19:0x00",
          "20:0x64",
          "21:0x00",
          "22:0x00",
          "23:0x00",
          "24:0x00",
          "25:0x00",
          "26:0x00",
          "27:0x00",
          "28:0x38",
          "29:0x00",
          "30:0x00",
          "31:0x00",
          "32:0x18",
          "33:0x00",
          "34:0x00",
          "35:0x00",
          "36:0x00",
          "37:0x00",
          "38:0x00",
          "39:0x00",
          "40:0x05",
          "41:0x00",
          "42:0x0b",
          "43:0x00",
          "44:0x00",
          "45:0x69",
          "46:0x6d",
          "47:0x20",
          "48:0x61",
          "49:0x20",
          "50:0x73",
          "51:0x74",
          "52:0x72",
          "53:0x69",
          "54:0x6e",
          "55:0x67",
          "56:0x10",
          "57:0x00",
          "58:0x00",
          "59:0x00",
          "60:0x20",
          "61:0x00",
          "62:0x00",
          "63:0x00",
          "64:0x06",
          "65:0x01",
          "66:0x00",
          "67:0x00",
          "68:0x00",
          "69:0x00",
          "70:0x00",
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
          "96:0x00",
          "97:0x00",
          "98:0x00",
          "99:0x00",
        ]
      `);
    });
  });
});
