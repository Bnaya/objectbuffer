/* eslint-env jest */

import { stringEncodeInto } from "./stringEncodeInto";
import { stringDecode } from "./stringDecode";

describe("stringDecode", () => {
  let ab = new ArrayBuffer(1024);
  let uint8 = new Uint8Array(ab);

  beforeEach(() => {
    ab = new ArrayBuffer(1024);
    uint8 = new Uint8Array(ab);
  });

  const testSet: Array<[string, number]> = [
    ["אבגד a", 10],
    [
      `請教「署」在文中的含義。 文句中「署」是什么意思？「使直言署」，及下文的「署帛宛然」a`,
      125,
    ],
  ];

  test.each(testSet)(
    "stringEncodeInto %s and decode back",
    (inputStr, expectedLength) => {
      const bytesLength = stringEncodeInto(uint8, 0, inputStr);
      expect(bytesLength).toBe(expectedLength);
      expect(stringDecode(uint8.subarray(0, bytesLength), 0, bytesLength)).toBe(
        inputStr
      );
    }
  );

  test("stringDecode", () => {
    const input = "אבגד";
    const fromPos = 3;

    const bytesLength = stringEncodeInto(uint8, fromPos, input);

    expect(bytesLength).toMatchInlineSnapshot(`8`);
    expect(
      stringDecode(uint8.subarray(3, bytesLength + fromPos), 0, bytesLength)
    ).toMatchInlineSnapshot(`"אבגד"`);
  });

  test("stringDecode abc", () => {
    const uint8 = new Uint8Array([0, 0, 97, 98, 99]);

    expect(stringDecode(uint8, 2, 3)).toMatchInlineSnapshot(`"abc"`);
  });
});
