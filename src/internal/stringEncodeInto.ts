// https://github.com/anonyco/FastestSmallestTextEncoderDecoder/blob/master/EncoderDecoderTogether.src.js
// https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder#Polyfill
export function stringEncodeInto(uint8: Uint8Array, from: number, str: string) {
  const strLen = str.length;
  let resPos = from - 1;

  for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
    (point = str.charCodeAt(i)), (i += 1);
    if (point >= 0xd800 && point <= 0xdbff) {
      if (i === strLen) {
        uint8[(resPos += 1)] = 0xef /*0b11101111*/;
        uint8[(resPos += 1)] = 0xbf /*0b10111111*/;
        uint8[(resPos += 1)] = 0xbd /*0b10111101*/;
        break;
      }
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      nextCode = str.charCodeAt(i);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        point = (point - 0xd800) * 0x400 + nextCode - 0xdc00 + 0x10000;
        i += 1;
        if (point > 0xffff) {
          uint8[(resPos += 1)] = (0x1e /*0b11110*/ << 3) | (point >>> 18);
          uint8[(resPos += 1)] =
            (0x2 /*0b10*/ << 6) | ((point >>> 12) & 0x3f) /*0b00111111*/;
          uint8[(resPos += 1)] =
            (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f) /*0b00111111*/;
          uint8[(resPos += 1)] =
            (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
          continue;
        }
      } else {
        uint8[(resPos += 1)] = 0xef /*0b11101111*/;
        uint8[(resPos += 1)] = 0xbf /*0b10111111*/;
        uint8[(resPos += 1)] = 0xbd /*0b10111101*/;
        continue;
      }
    }
    if (point <= 0x007f) {
      uint8[(resPos += 1)] = (0x0 /*0b0*/ << 7) | point;
    } else if (point <= 0x07ff) {
      uint8[(resPos += 1)] = (0x6 /*0b110*/ << 5) | (point >>> 6);
      uint8[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
    } else {
      uint8[(resPos += 1)] = (0xe /*0b1110*/ << 4) | (point >>> 12);
      uint8[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f) /*0b00111111*/;
      uint8[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
    }
  }

  return resPos + 1 - from;
}
