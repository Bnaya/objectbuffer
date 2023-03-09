/* eslint-env jest */

import { ENTRY_TYPE } from "./entry-types";

describe("Test Entry types", () => {
  test("Freeze Entry types", () => {
    expect(ENTRY_TYPE).toMatchInlineSnapshot(`
      {
        "11": "MAP",
        "12": "SET",
        "13": "DATE",
        "2": "NUMBER",
        "3": "BIGINT_POSITIVE",
        "4": "BIGINT_NEGATIVE",
        "5": "STRING",
        "7": "OBJECT",
        "9": "ARRAY",
        "ARRAY": 9,
        "BIGINT_NEGATIVE": 4,
        "BIGINT_POSITIVE": 3,
        "DATE": 13,
        "MAP": 11,
        "NUMBER": 2,
        "OBJECT": 7,
        "SET": 12,
        "STRING": 5,
      }
    `);
  });
});
