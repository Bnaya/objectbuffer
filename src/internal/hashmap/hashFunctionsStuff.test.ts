/* eslint-env jest */

import { hashString, hashUint8CodeInPlace } from "./hashFunctionsStuff";
import { stringEncodeInto } from "../stringEncodeInto";
import { stringLengthV2 } from "../stringLengthV2";

function prepHashes(str: string) {
  const uint8 = new Uint8Array(stringLengthV2(str));
  stringEncodeInto(uint8, 0, str);

  const uint8Hash = hashUint8CodeInPlace(uint8, 0, uint8.byteLength);
  const flatHash = hashString(str);

  return {
    uint8Hash,
    flatHash,
  };
}

describe("hashCodeExternalValue", () => {
  test("simple string comparison", () => {
    const str = "a23452345";

    const { uint8Hash, flatHash } = prepHashes(str);

    expect(flatHash).toBe(uint8Hash);

    expect(flatHash).toMatchInlineSnapshot(`1568997221`);
  });

  test("simple string comparison 3", () => {
    const str = "myDate";

    const { uint8Hash, flatHash } = prepHashes(str);

    expect(flatHash).toBe(uint8Hash);

    expect(flatHash).toMatchInlineSnapshot(`1060521094`);
  });

  test("simple string comparison 3", () => {
    const str = "bigintNegative";

    const { uint8Hash, flatHash } = prepHashes(str);

    expect(flatHash).toBe(uint8Hash);

    expect(flatHash).toMatchInlineSnapshot(`700576700`);
  });

  test("simple string comparison 4", () => {
    const str = "bigintPositive";

    const { uint8Hash, flatHash } = prepHashes(str);

    expect(flatHash).toBe(uint8Hash);

    expect(flatHash).toMatchInlineSnapshot(`873883128`);
  });
});
