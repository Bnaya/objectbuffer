/* eslint-env jest */

import { initializeArrayBuffer } from "./store";
import * as util from "util";
import { createArrayWrapper } from "./arrayWrapper";
import { arraySaver } from "./arraySaver";
import { getFirstFreeByte } from "./testUtils";
import { ExternalArgs } from "./interfaces";

describe("arraySplice tests", () => {
  const externalArgs: ExternalArgs = {
    textEncoder: new util.TextEncoder(),
    textDecoder: new util.TextDecoder(),
    arrayAdditionalAllocation: 0,
    minimumStringAllocation: 0
  };

  test("arrayWrapper splice - add + delete - array stay in same length", () => {
    const arrayBuffer = new ArrayBuffer(256);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(2, 3, "a", "b", "c");
    const removedFromPlain = plainJSArray.splice(2, 3, "a", "b", "c");

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`188`);
  });

  test("arrayWrapper splice - Just delete items from the middle", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    arrayWrapper.splice(2, 3);
    plainJSArray.splice(2, 3);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`167`);
  });

  test("arrayWrapper splice - Just add items in the middle", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    arrayWrapper.splice(4, 0, "a", "b");
    plainJSArray.splice(4, 0, "a", "b");

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        "a",
        "b",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        "a",
        "b",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);
    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`241`);
  });

  test("arrayWrapper splice - add + delete - array will get longer", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(2, 2, "a", "b", "c", "d");
    const removedFromPlain = plainJSArray.splice(2, 2, "a", "b", "c", "d");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`12`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`255`);
  });

  test("arrayWrapper splice - add + delete - array will get shorter", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(2, 6, "a", "b", "c", "d");
    const removedFromPlain = plainJSArray.splice(2, 6, "a", "b", "c", "d");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`8`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`8`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
        "c",
        "d",
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
        6,
        7,
        8,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
        6,
        7,
        8,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`195`);
  });

  test("arrayWrapper splice - start bigger than array", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(12, 3, "a", "b");
    const removedFromPlain = plainJSArray.splice(12, 3, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`12`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`12`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        "a",
        "b",
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        "a",
        "b",
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`Array []`);
    expect(removedFromPlain).toMatchInlineSnapshot(`Array []`);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`241`);
  });

  test("arrayWrapper splice - delete bigger than array", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(2, 20, "a", "b");
    const removedFromPlain = plainJSArray.splice(2, 20, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`4`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`4`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        "a",
        "b",
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`181`);
  });

  test("arrayWrapper splice - negative start", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(-4, 1, "a", "b");
    const removedFromPlain = plainJSArray.splice(-4, 1, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`11`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`11`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        "a",
        "b",
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        5,
        6,
        "a",
        "b",
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`
      Array [
        7,
      ]
    `);
    expect(removedFromPlain).toMatchInlineSnapshot(`
      Array [
        7,
      ]
    `);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`237`);
  });

  test("arrayWrapper splice - negative delete", () => {
    const arrayBuffer = new ArrayBuffer(512);
    const dataView = new DataView(arrayBuffer);
    initializeArrayBuffer(arrayBuffer);

    const plainJSArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const saverOutput = arraySaver(externalArgs, dataView, plainJSArray);

    const arrayWrapper = createArrayWrapper(
      { ...externalArgs, arrayAdditionalAllocation: 3 },
      { dataView },
      saverOutput.start
    );

    const removed = arrayWrapper.splice(4, -1, "a", "b");
    const removedFromPlain = plainJSArray.splice(4, -1, "a", "b");

    expect(arrayWrapper.length).toMatchInlineSnapshot(`12`);
    expect(plainJSArray.length).toMatchInlineSnapshot(`12`);

    expect(arrayWrapper).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        "a",
        "b",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);
    expect(plainJSArray).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
        4,
        "a",
        "b",
        5,
        6,
        7,
        8,
        9,
        10,
      ]
    `);

    expect(plainJSArray).toEqual([...arrayWrapper]);

    expect(removed).toMatchInlineSnapshot(`Array []`);
    expect(removedFromPlain).toMatchInlineSnapshot(`Array []`);

    expect(removedFromPlain).toEqual([...removed]);

    expect(getFirstFreeByte(arrayBuffer)).toMatchInlineSnapshot(`241`);
  });
});
