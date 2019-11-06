export function arrayBuffer2HexArray(
  buffer: ArrayBuffer,
  withByteNumber = false
) {
  if (withByteNumber) {
    return Array.prototype.map.call(
      new Uint8Array(buffer),
      (x: number, index) => `${index}:${x.toString(16).padStart(4, "0x")}`
    );
  }
  return Array.prototype.map.call(new Uint8Array(buffer), (x: number) =>
    x.toString(16).padStart(4, "0x")
  );
}

export function wait(time: number) {
  return new Promise(res => {
    // eslint-disable-next-line no-undef
    setTimeout(res, time);
  });
}
