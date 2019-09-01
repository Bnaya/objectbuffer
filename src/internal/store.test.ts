/* eslint-env jest */

import {
  writeEntry,
  initializeArrayBuffer,
  readEntry,
  appendEntry
} from "./store";
import { ENTRY_TYPE } from "./entry-types";
import * as utils from "util";
import { arrayBuffer2HexArray } from "./testUtils";
import { ObjectEntry, ObjectPropEntry } from "./interfaces";

describe("Store tests - Misc", () => {
  test("initializeArrayBuffer", () => {
    const arrayBuffer = new ArrayBuffer(16);

    initializeArrayBuffer(arrayBuffer);
    expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
      Array [
        "0:0x00",
        "1:0x00",
        "2:0x00",
        "3:0x10",
        "4:0x00",
        "5:0x00",
        "6:0x00",
        "7:0x00",
        "8:0x00",
        "9:0x00",
        "10:0x00",
        "11:0x10",
        "12:0x00",
        "13:0x00",
        "14:0x00",
        "15:0x00",
      ]
    `);
  });
});

describe("Store tests writeEntry", () => {
  test("writeEntry max number", () => {
    const textEncoder = new utils.TextEncoder();
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(
      dataView,
      8,
      {
        type: ENTRY_TYPE.NUMBER,
        value: Number.MAX_VALUE
      },
      textEncoder
    );
    expect(writtenLength).toBe(9);

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
    const textEncoder = new utils.TextEncoder();
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(
      dataView,
      8,
      {
        type: ENTRY_TYPE.NUMBER,
        value: Number.MIN_VALUE
      },
      textEncoder
    );
    expect(writtenLength).toBe(9);

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
    const textEncoder = new utils.TextEncoder();
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(
      dataView,
      8,
      {
        type: ENTRY_TYPE.STRING,
        value: "aא弟"
      },
      textEncoder
    );
    expect(writtenLength).toBe(9);

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
  test("readEntry max number", () => {
    const textEncoder = new utils.TextEncoder();
    const textDecoder = new utils.TextDecoder();
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(
      dataView,
      8,
      { type: ENTRY_TYPE.NUMBER, value: Number.MAX_VALUE },
      textEncoder
    );

    const [redEntry, redBytesLength] = readEntry(dataView, 8, textDecoder);

    expect(redBytesLength).toBe(writtenLength);

    expect(redEntry).toMatchInlineSnapshot(`
      Object {
        "type": 2,
        "value": 1.7976931348623157e+308,
      }
    `);
  });

  test("readEntry min number", () => {
    const textEncoder = new utils.TextEncoder();
    const textDecoder = new utils.TextDecoder();
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(
      dataView,
      8,
      { type: ENTRY_TYPE.NUMBER, value: Number.MIN_VALUE },
      textEncoder
    );

    const [redEntry, redBytesLength] = readEntry(dataView, 8, textDecoder);

    expect(redBytesLength).toBe(writtenLength);

    expect(redEntry).toMatchInlineSnapshot(`
      Object {
        "type": 2,
        "value": 5e-324,
      }
    `);
  });

  test("readEntry string", () => {
    const textEncoder = new utils.TextEncoder();
    const textDecoder = new utils.TextDecoder();
    const arrayBuffer = new ArrayBuffer(10);
    const dataView = new DataView(arrayBuffer);

    const writtenByteLength = writeEntry(
      dataView,
      0,
      {
        type: ENTRY_TYPE.STRING,
        value: "aא弟"
      },
      textEncoder
    );

    const [entry, redBytesLength] = readEntry(dataView, 0, textDecoder);

    expect(writtenByteLength).toBe(redBytesLength);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 5,
        "value": "aא弟",
      }
    `);
  });

  test("readEntry BigInt", () => {
    const textEncoder = new utils.TextEncoder();
    const textDecoder = new utils.TextDecoder();
    const arrayBuffer = new ArrayBuffer(16);
    const dataView = new DataView(arrayBuffer);

    const writtenByteLength = writeEntry(
      dataView,
      0,
      {
        type: ENTRY_TYPE.BIGINT,
        value: BigInt("0b0" + "1".repeat(63))
      },
      textEncoder
    );

    const [entry, redBytesLength] = readEntry(dataView, 0, textDecoder);

    expect(writtenByteLength).toBe(redBytesLength);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 3,
        "value": 9223372036854775807n,
      }
    `);
  });

  test("readEntry UBigInt", () => {
    const textEncoder = new utils.TextEncoder();
    const textDecoder = new utils.TextDecoder();
    const arrayBuffer = new ArrayBuffer(16);
    const dataView = new DataView(arrayBuffer);

    const writtenByteLength = writeEntry(
      dataView,
      0,
      { type: ENTRY_TYPE.UBIGINT, value: BigInt("0b" + "1".repeat(64)) },
      textEncoder
    );

    const [entry, redBytesLength] = readEntry(dataView, 0, textDecoder);

    expect(writtenByteLength).toBe(redBytesLength);

    expect(entry).toMatchInlineSnapshot(`
      Object {
        "type": 4,
        "value": 18446744073709551615n,
      }
    `);
  });

  describe("Store tests write/read entry", () => {
    test("object entry", () => {
      const textEncoder = new utils.TextEncoder();
      const textDecoder = new utils.TextDecoder();
      const arrayBuffer = new ArrayBuffer(8);
      const dataView = new DataView(arrayBuffer);

      const entryToWrite: ObjectEntry = {
        type: ENTRY_TYPE.OBJECT,
        value: 10
      };

      const writtenByteLength = writeEntry(
        dataView,
        0,
        entryToWrite,
        textEncoder
      );

      const [entry, redBytesLength] = readEntry(dataView, 0, textDecoder);

      expect(writtenByteLength).toBe(redBytesLength);

      expect(entry).toMatchInlineSnapshot(`
        Object {
          "type": 7,
          "value": 10,
        }
      `);
    });
  });

  test("object property entry", () => {
    const textEncoder = new utils.TextEncoder();
    const textDecoder = new utils.TextDecoder();
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

    const writtenByteLength = writeEntry(
      dataView,
      0,
      entryToWrite,
      textEncoder
    );

    const [entry, redBytesLength] = readEntry(dataView, 0, textDecoder);

    expect(writtenByteLength).toBe(redBytesLength);

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
      const arrayBuffer = new ArrayBuffer(32);
      const textEncoder = new utils.TextEncoder();
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const r1 = appendEntry(
        dataView,
        {
          type: ENTRY_TYPE.STRING,
          value: "im a string"
        },
        textEncoder
      );

      expect(r1).toMatchInlineSnapshot(`
        Object {
          "length": 14,
          "start": 16,
        }
      `);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
        Array [
          "0:0x00",
          "1:0x00",
          "2:0x00",
          "3:0x1e",
          "4:0x00",
          "5:0x00",
          "6:0x00",
          "7:0x00",
          "8:0x00",
          "9:0x00",
          "10:0x00",
          "11:0x10",
          "12:0x00",
          "13:0x00",
          "14:0x00",
          "15:0x00",
          "16:0x05",
          "17:0x00",
          "18:0x0b",
          "19:0x69",
          "20:0x6d",
          "21:0x20",
          "22:0x61",
          "23:0x20",
          "24:0x73",
          "25:0x74",
          "26:0x72",
          "27:0x69",
          "28:0x6e",
          "29:0x67",
          "30:0x00",
          "31:0x00",
        ]
      `);

      const r2 = appendEntry(
        dataView,
        {
          type: ENTRY_TYPE.BOOLEAN,
          value: true
        },
        textEncoder
      );

      expect(r2).toMatchInlineSnapshot(`
        Object {
          "length": 2,
          "start": 30,
        }
      `);
      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
        Array [
          "0:0x00",
          "1:0x00",
          "2:0x00",
          "3:0x20",
          "4:0x00",
          "5:0x00",
          "6:0x00",
          "7:0x00",
          "8:0x00",
          "9:0x00",
          "10:0x00",
          "11:0x10",
          "12:0x00",
          "13:0x00",
          "14:0x00",
          "15:0x00",
          "16:0x05",
          "17:0x00",
          "18:0x0b",
          "19:0x69",
          "20:0x6d",
          "21:0x20",
          "22:0x61",
          "23:0x20",
          "24:0x73",
          "25:0x74",
          "26:0x72",
          "27:0x69",
          "28:0x6e",
          "29:0x67",
          "30:0x06",
          "31:0x01",
        ]
      `);
    });
  });
});
