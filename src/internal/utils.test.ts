/* eslint-env jest */
import { arrayBufferCopyTo } from "./utils";

describe("utils test", () => {
  test("arrayBufferCopyTo", () => {
    const ab1 = new ArrayBuffer(10);
    const view = new Uint8Array(ab1);

    view.forEach((v, i) => {
      view[i] = i;
    });

    const ab2 = new SharedArrayBuffer(5);

    arrayBufferCopyTo(ab1, 3, 5, ab2, 0);

    const view2 = new Uint8Array(ab2);

    expect(view2).toMatchInlineSnapshot(`
      Uint8Array [
        3,
        4,
        5,
        6,
        7,
      ]
    `);
  });
});
