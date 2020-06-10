/* istanbul ignore file */
// https://github.com/anonyco/FastestSmallestTextEncoderDecoder/blob/master/EncoderDecoderTogether.src.js
// https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder#Polyfill
export function stringLengthV2(str: string) {
  const strLen = str.length;
  let resPos = -1;

  for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
    (point = str.charCodeAt(i)), (i += 1);
    if (point >= 0xd800 && point <= 0xdbff) {
      if (i === strLen) {
        resPos += 3;
        break;
      }
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      nextCode = str.charCodeAt(i);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        point = (point - 0xd800) * 0x400 + nextCode - 0xdc00 + 0x10000;
        i += 1;
        if (point > 0xffff) {
          resPos += 4;
          continue;
        }
      } else {
        resPos += 3;
        continue;
      }
    }
    if (point <= 0x007f) {
      resPos += 1;
    } else if (point <= 0x07ff) {
      resPos += 2;
    } else {
      resPos += 3;
    }
  }

  return resPos + 1;
}
