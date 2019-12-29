/* eslint-env jest */

import * as util from "util";
import { stringEncodeInto } from "./stringEncodeInto";

describe("stringEncodeInto", () => {
  const stringDecoder = new util.TextDecoder();

  let ab = new ArrayBuffer(1024);
  let uint8 = new Uint8Array(ab);

  beforeEach(() => {
    ab = new ArrayBuffer(1024);
    uint8 = new Uint8Array(ab);
  });

  const testSet: Array<[string, number]> = [
    ["אבגד", 8],
    [
      `請教「署」在文中的含義。 文句中「署」是什么意思？「使直言署」，及下文的「署帛宛然」`,
      124
    ]
  ];

  test.each(testSet)(
    "stringEncodeInto %s and decode back",
    (inputStr, expectedLength) => {
      const bytesLength = stringEncodeInto(uint8, 0, inputStr);
      expect(bytesLength).toBe(expectedLength);
      expect(stringDecoder.decode(uint8.slice(0, bytesLength))).toBe(inputStr);
    }
  );

  test("stringEncodeInto from", () => {
    const input = "אבגד";
    const fromPos = 3;

    const bytesLength = stringEncodeInto(uint8, fromPos, input);

    expect(bytesLength).toMatchInlineSnapshot(`8`);
    expect(
      stringDecoder.decode(uint8.slice(3, bytesLength + fromPos))
    ).toMatchInlineSnapshot(`"אבגד"`);
  });
});
