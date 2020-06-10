/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

const repeat = 30;
const strInput =
  "請教「署」在文中的含義。 文句中「署」是什么意思？「使直言署」，及下文的「署帛宛然」 אבגדג דשכ345 請教「署」在文中的含義。" +
  " 文句中「署」是什么意思？「使直言署」，及下文的「署帛宛然」 asdfq423 asfdשדגכ דכ 請教「署」在文中的含義。 " +
  "文句中「署」是什么意思？「使直言署」，及下文的「署帛宛然」".repeat(repeat);
const strInputLength = strInput.length;

const ab = new ArrayBuffer(strInputLength * 3);
const uint8 = new Uint8Array(ab);

function stringEncodeInto2(uint8, from, str) {
  const strLen = str.length;
  let resPos = from - 1;
  const resArr = uint8;

  for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
    (point = str.charCodeAt(i)), (i += 1);
    if (point >= 0xd800 && point <= 0xdbff) {
      if (i === strLen) {
        resArr[(resPos += 1)] = 0xef /*0b11101111*/;
        resArr[(resPos += 1)] = 0xbf /*0b10111111*/;
        resArr[(resPos += 1)] = 0xbd /*0b10111101*/;
        break;
      }
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      nextCode = str.charCodeAt(i);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        point = (point - 0xd800) * 0x400 + nextCode - 0xdc00 + 0x10000;
        i += 1;
        if (point > 0xffff) {
          resArr[(resPos += 1)] = (0x1e /*0b11110*/ << 3) | (point >>> 18);
          resArr[(resPos += 1)] =
            (0x2 /*0b10*/ << 6) | ((point >>> 12) & 0x3f) /*0b00111111*/;
          resArr[(resPos += 1)] =
            (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f) /*0b00111111*/;
          resArr[(resPos += 1)] =
            (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
          continue;
        }
      } else {
        resArr[(resPos += 1)] = 0xef /*0b11101111*/;
        resArr[(resPos += 1)] = 0xbf /*0b10111111*/;
        resArr[(resPos += 1)] = 0xbd /*0b10111101*/;
        continue;
      }
    }
    if (point <= 0x007f) {
      resArr[(resPos += 1)] = (0x0 /*0b0*/ << 7) | point;
    } else if (point <= 0x07ff) {
      resArr[(resPos += 1)] = (0x6 /*0b110*/ << 5) | (point >>> 6);
      resArr[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
    } else {
      resArr[(resPos += 1)] = (0xe /*0b1110*/ << 4) | (point >>> 12);
      resArr[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f) /*0b00111111*/;
      resArr[(resPos += 1)] =
        (0x2 /*0b10*/ << 6) | (point & 0x3f) /*0b00111111*/;
    }
  }
  return resPos + 1 - from;
}

for (let i = 0; i < 1000000; i++) {
  stringEncodeInto2(uint8, 0, strInput);
}

// eslint-disable-next-line no-undef
console.log("Done");
