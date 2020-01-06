// https://github.com/anonyco/FastestSmallestTextEncoderDecoder/blob/master/individual/FastestTextDecoderPolyfill.src.js

const clz32 = Math.clz32;
const fromCharCode = String.fromCharCode;

function decoderReplacer(encoded: string) {
  let codePoint = encoded.charCodeAt(0) << 24;
  const leadingOnes = clz32(~codePoint) | 0;
  let endPos = 0;
  const stringLen = encoded.length | 0;
  let result = "";
  if (leadingOnes < 5 && stringLen >= leadingOnes) {
    codePoint = (codePoint << leadingOnes) >>> (24 + leadingOnes);
    for (endPos = 1; endPos < leadingOnes; endPos = (endPos + 1) | 0)
      codePoint =
        (codePoint << 6) | (encoded.charCodeAt(endPos) & 0x3f) /*0b00111111*/;
    if (codePoint <= 0xffff) {
      // BMP code point
      result += fromCharCode(codePoint);
    } else if (codePoint <= 0x10ffff) {
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      codePoint = (codePoint - 0x10000) | 0;
      result += fromCharCode(
        ((codePoint >> 10) + 0xd800) | 0, // highSurrogate
        ((codePoint & 0x3ff) + 0xdc00) | 0 // lowSurrogate
      );
    } else endPos = 0; // to fill it in with INVALIDs
  }
  for (; endPos < stringLen; endPos = (endPos + 1) | 0) result += "\ufffd"; // replacement character
  return result;
}

export function stringDecode(
  uint8: Uint8Array,
  from: number,
  bytesLength: number
) {
  const finalUint8 = uint8.subarray(from, from + bytesLength);

  let resultingString = "";

  for (
    let index = 0, len = finalUint8.length | 0;
    index < len;
    index = (index + 32768) | 0
  ) {
    resultingString += fromCharCode.apply(
      0,
      finalUint8.subarray(index, (index + 32768) | 0) as any
    );
  }

  return resultingString.replace(/[\xc0-\xff][\x80-\xbf]*/g, decoderReplacer);
}
