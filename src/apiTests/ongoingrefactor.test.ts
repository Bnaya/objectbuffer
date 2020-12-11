/* eslint-env jest */
import { createObjectBuffer } from "../index";
describe("ongoingrefactor", function () {
  test("something", function () {
    const ob = createObjectBuffer<any>(1024, {
      a: "a",
      b: "a",
    });

    ob.a = undefined;

    expect(ob).toMatchInlineSnapshot(`
      Object {
        "a": undefined,
        "b": "a",
      }
    `);
  });

  test("ongoingrefactor", function () {
    const ob = createObjectBuffer(1024 * 4, {
      b: "some string",
      propName123a: undefined,
      a: 1,
      y: null,
      nestedObj: {
        thevlaueisnumber: 1,
      },
      arr1: [1, 2, 3, 4, 5, 6],
      arr2: ["a", "b", "c"],
      arr3: [{}, ["a", "b", 3], { a: "c" }],
    });
    expect(ob).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "arr1": Array [
          1,
          2,
          3,
          4,
          5,
          6,
        ],
        "arr2": Array [
          "a",
          "b",
          "c",
        ],
        "arr3": Array [
          Object {},
          Array [
            "a",
            "b",
            3,
          ],
          Object {
            "a": "c",
          },
        ],
        "b": "some string",
        "nestedObj": Object {
          "thevlaueisnumber": 1,
        },
        "propName123a": undefined,
        "y": null,
      }
    `);
  });

  test("several refs to the same object", function () {
    const a = { b: 1 };
    const ob = createObjectBuffer(2048 * 2, {
      b: a,
      propName123a: a,
      a: a,
      y: a,
      nestedObj: a,
      arr1: a,
      // un comment one more will stuck it
      // arr2: a,
      // arr3: a,
    });

    ob.a.b = 5;

    expect(ob).toMatchInlineSnapshot(`
      Object {
        "a": Object {
          "b": 5,
        },
        "arr1": Object {
          "b": 5,
        },
        "b": Object {
          "b": 5,
        },
        "nestedObj": Object {
          "b": 5,
        },
        "propName123a": Object {
          "b": 5,
        },
        "y": Object {
          "b": 5,
        },
      }
    `);
  });

  test("circular refs", function () {
    const a: any = { a: null, b: {} };
    a.b.circle = a.b;
    const ob = createObjectBuffer(2048 * 2, a);

    expect(ob.b.circle).toEqual(ob.b);
  });
});
