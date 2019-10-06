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
        "7:0x00",
        "8:0x00",
        "9:0x00",
        "10:0x00",
        "11:0x18",
        "12:0x00",
        "13:0x00",
        "14:0x00",
        "15:0x00",
        "16:0x00",
        "17:0x00",
        "18:0x00",
        "19:0x18",
      ]
    `);
  });
});

describe("Store tests writeEntry", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("writeEntry max number", () => {
    const externalArgs: ExternalArgs = {
      textEncoder: new util.TextEncoder(),
      textDecoder: new util.TextDecoder(),
      arrayAdditionalAllocation: 0,
      minimumStringAllocation: 0
    };

    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MAX_VALUE
    });
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
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MIN_VALUE
    });
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
    const arrayBuffer = new ArrayBuffer(19);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.STRING,
      value: "aא弟",
      allocatedBytes: 0
    });
    expect(writtenLength).toBe(11);

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
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("readEntry max number", () => {
    const arrayBuffer = new ArrayBuffer(17);
    const dataView = new DataView(arrayBuffer);

    const writtenLength = writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MAX_VALUE
    });

    const [redEntry, redBytesLength] = readEntry(externalArgs, dataView, 8);

    expect(redBytesLength).toBe(writtenLength);

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

    const writtenLength = writeEntry(externalArgs, dataView, 8, {
      type: ENTRY_TYPE.NUMBER,
      value: Number.MIN_VALUE
    });

    const [redEntry, redBytesLength] = readEntry(externalArgs, dataView, 8);

    expect(redBytesLength).toBe(writtenLength);

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

    const writtenByteLength = writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.STRING,
      value: "aא弟",
      allocatedBytes: 0
    });

    const [entry, redBytesLength] = readEntry(externalArgs, dataView, 0);

    expect(writtenByteLength).toBe(redBytesLength);

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

    const writtenByteLength = writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.BIGINT,
      value: BigInt("0b0" + "1".repeat(63))
    });

    const [entry, redBytesLength] = readEntry(externalArgs, dataView, 0);

    expect(writtenByteLength).toBe(redBytesLength);

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

    const writtenByteLength = writeEntry(externalArgs, dataView, 0, {
      type: ENTRY_TYPE.UBIGINT,
      value: BigInt("0b" + "1".repeat(64))
    });

    const [entry, redBytesLength] = readEntry(externalArgs, dataView, 0);

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
      const arrayBuffer = new ArrayBuffer(8);
      const dataView = new DataView(arrayBuffer);

      const entryToWrite: ObjectEntry = {
        type: ENTRY_TYPE.OBJECT,
        value: 10
      };

      const writtenByteLength = writeEntry(
        externalArgs,
        dataView,
        0,
        entryToWrite
      );

      const [entry, redBytesLength] = readEntry(externalArgs, dataView, 0);

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
      externalArgs,
      dataView,
      0,
      entryToWrite
    );

    const [entry, redBytesLength] = readEntry(externalArgs, dataView, 0);

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
      const arrayBuffer = new ArrayBuffer(42);
      const dataView = new DataView(arrayBuffer);
      initializeArrayBuffer(arrayBuffer);

      const r1 = appendEntry(externalArgs, dataView, {
        type: ENTRY_TYPE.STRING,
        value: "im a string",
        allocatedBytes: 0
      });

      expect(r1).toMatchInlineSnapshot(`
        Object {
          "length": 16,
          "start": 24,
        }
      `);

      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
        Array [
          "0:0x00",
          "1:0x00",
          "2:0x00",
          "3:0x00",
          "4:0x00",
          "5:0x00",
          "6:0x00",
          "7:0x00",
          "8:0x00",
          "9:0x00",
          "10:0x00",
          "11:0x28",
          "12:0x00",
          "13:0x00",
          "14:0x00",
          "15:0x00",
          "16:0x00",
          "17:0x00",
          "18:0x00",
          "19:0x18",
          "20:0x00",
          "21:0x00",
          "22:0x00",
          "23:0x00",
          "24:0x05",
          "25:0x00",
          "26:0x0b",
          "27:0x00",
          "28:0x00",
          "29:0x69",
          "30:0x6d",
          "31:0x20",
          "32:0x61",
          "33:0x20",
          "34:0x73",
          "35:0x74",
          "36:0x72",
          "37:0x69",
          "38:0x6e",
          "39:0x67",
          "40:0x00",
          "41:0x00",
        ]
      `);

      const r2 = appendEntry(externalArgs, dataView, {
        type: ENTRY_TYPE.BOOLEAN,
        value: true
      });

      expect(r2).toMatchInlineSnapshot(`
        Object {
          "length": 2,
          "start": 40,
        }
      `);
      expect(arrayBuffer2HexArray(arrayBuffer, true)).toMatchInlineSnapshot(`
        Array [
          "0:0x00",
          "1:0x00",
          "2:0x00",
          "3:0x00",
          "4:0x00",
          "5:0x00",
          "6:0x00",
          "7:0x00",
          "8:0x00",
          "9:0x00",
          "10:0x00",
          "11:0x2a",
          "12:0x00",
          "13:0x00",
          "14:0x00",
          "15:0x00",
          "16:0x00",
          "17:0x00",
          "18:0x00",
          "19:0x18",
          "20:0x00",
          "21:0x00",
          "22:0x00",
          "23:0x00",
          "24:0x05",
          "25:0x00",
          "26:0x0b",
          "27:0x00",
          "28:0x00",
          "29:0x69",
          "30:0x6d",
          "31:0x20",
          "32:0x61",
          "33:0x20",
          "34:0x73",
          "35:0x74",
          "36:0x72",
          "37:0x69",
          "38:0x6e",
          "39:0x67",
          "40:0x06",
          "41:0x01",
        ]
      `);
    });
  });
});
