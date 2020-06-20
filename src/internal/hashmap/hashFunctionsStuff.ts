export function hashCodeExternalValue(value: string | number): number {
  if (typeof value === "number") {
    return hashNumber(value);
  }

  return hashString(value);
}

/**
 * We may replace that with code that knows to break down float into bytes
 */
const helperFloatArray = new Float64Array(1);
const helperUint8Array = new Uint8Array(helperFloatArray.buffer);

export function hashNumber(num: number) {
  helperFloatArray[0] = num;

  return hashUint8CodeInPlace(helperUint8Array, 0, helperUint8Array.byteLength);
}

export function hashUint8CodeInPlace(
  uint8: Uint8Array,
  keyStart: number,
  keyBytesLength: number
): number {
  let h = 0 | 0;

  // const hashed: number[] = [];

  for (let i = 0; i < keyBytesLength; i++) {
    // h = (Math.imul(31, h) + uint8[i + keyStart]) | 0;
    h = hashStep(h, uint8[i + keyStart]);
  }

  // console.log(hashed);

  return Math.abs(h);
}

function hashStep(h: number, v: number) {
  // console.log({ h, v });
  return (Math.imul(31, h) + v) | 0;
}

export function hashString(str: string) {
  const strLen = str.length;
  let h = 0 | 0;

  for (let point = 0, nextCode = 0, i = 0; i !== strLen; ) {
    (point = str.charCodeAt(i)), (i += 1);

    if (point >= 0xd800 && point <= 0xdbff) {
      if (i === strLen) {
        h = hashStep(h, 0xef) /*0b11101111*/;
        h = hashStep(h, 0xbf) /*0b10111111*/;
        h = hashStep(h, 0xbd) /*0b10111101*/;
        break;
      }
      // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
      nextCode = str.charCodeAt(i);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        point = (point - 0xd800) * 0x400 + nextCode - 0xdc00 + 0x10000;
        i += 1;
        if (point > 0xffff) {
          h = hashStep(h, (0x1e /*0b11110*/ << 3) | (point >>> 18));
          h = hashStep(
            h,
            (0x2 /*0b10*/ << 6) | ((point >>> 12) & 0x3f)
          ) /*0b00111111*/;
          h = hashStep(
            h,
            (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f)
          ) /*0b00111111*/;
          h = hashStep(h, (0x2 /*0b10*/ << 6) | (point & 0x3f)) /*0b00111111*/;
          continue;
        }
      } else {
        h = hashStep(h, 0xef) /*0b11101111*/;
        h = hashStep(h, 0xbf) /*0b10111111*/;
        h = hashStep(h, 0xbd) /*0b10111101*/;
        continue;
      }
    }
    if (point <= 0x007f) {
      h = hashStep(h, (0x0 /*0b0*/ << 7) | point);
    } else if (point <= 0x07ff) {
      h = hashStep(h, (0x6 /*0b110*/ << 5) | (point >>> 6));
      h = hashStep(h, (0x2 /*0b10*/ << 6) | (point & 0x3f)) /*0b00111111*/;
    } else {
      h = hashStep(h, (0xe /*0b1110*/ << 4) | (point >>> 12));
      h = hashStep(
        h,
        (0x2 /*0b10*/ << 6) | ((point >>> 6) & 0x3f)
      ) /*0b00111111*/;
      h = hashStep(h, (0x2 /*0b10*/ << 6) | (point & 0x3f)) /*0b00111111*/;
    }
  }

  return Math.abs(h);
}
