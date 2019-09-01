/* eslint-env jest */

import { ENTRY_TYPE } from "./entry-types";

describe("Test Entry types", () => {
  test("Freeze Entry types", () => {
    expect(ENTRY_TYPE).toMatchInlineSnapshot(`
      Object {
        "0": "NULL",
        "1": "UNDEFINED",
        "10": "ARRAY_ITEM",
        "11": "MAP",
        "12": "SET",
        "13": "DATE",
        "2": "NUMBER",
        "3": "BIGINT",
        "4": "UBIGINT",
        "5": "STRING",
        "6": "BOOLEAN",
        "7": "OBJECT",
        "8": "OBJECT_PROP",
        "9": "ARRAY",
        "ARRAY": 9,
        "ARRAY_ITEM": 10,
        "BIGINT": 3,
        "BOOLEAN": 6,
        "DATE": 13,
        "MAP": 11,
        "NULL": 0,
        "NUMBER": 2,
        "OBJECT": 7,
        "OBJECT_PROP": 8,
        "SET": 12,
        "STRING": 5,
        "UBIGINT": 4,
        "UNDEFINED": 1,
      }
    `);
  });
});
