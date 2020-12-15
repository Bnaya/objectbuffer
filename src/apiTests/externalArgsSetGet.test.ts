/* eslint-env jest */

import { updateObjectBufferSettings, createObjectBuffer } from "..";
import { readObjectBufferSettings } from "../internal/api";

test("readObjectBufferSettings", () => {
  const ob = createObjectBuffer(
    512,
    {},
    {
      hashMapLoadFactor: 2,
      arrayAdditionalAllocation: 5,
    }
  );

  expect(readObjectBufferSettings(ob)).toEqual({
    hashMapLoadFactor: 2,
    arrayAdditionalAllocation: 5,
    hashMapMinInitialCapacity: 8,
  });
});

test("updateObjectBufferSettings", () => {
  const ob = createObjectBuffer(
    512,
    {},
    {
      hashMapLoadFactor: 2,
      arrayAdditionalAllocation: 7,
    }
  );

  updateObjectBufferSettings(ob, {
    hashMapLoadFactor: 10,
    arrayAdditionalAllocation: 5,
    hashMapMinInitialCapacity: 20,
  });

  expect(readObjectBufferSettings(ob)).toEqual({
    hashMapLoadFactor: 10,
    arrayAdditionalAllocation: 5,
    hashMapMinInitialCapacity: 20,
  });
});
