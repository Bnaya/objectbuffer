/* eslint-env jest */

import { updateExternalArgs, createObjectBuffer } from "..";
import { readExternalArgs } from "../internal/api";

test("readExternalArgs", () => {
  const ob = createObjectBuffer(
    { hashMapLoadFactor: 2, arrayAdditionalAllocation: 5 },
    512,
    {}
  );

  expect(readExternalArgs(ob)).toEqual({
    hashMapLoadFactor: 2,
    arrayAdditionalAllocation: 5,
    hashMapMinInitialCapacity: 8,
  });
});

test("updateExternalArgs", () => {
  const ob = createObjectBuffer(
    { hashMapLoadFactor: 2, arrayAdditionalAllocation: 7 },
    512,
    {}
  );

  updateExternalArgs(ob, {
    hashMapLoadFactor: 10,
    arrayAdditionalAllocation: 5,
    hashMapMinInitialCapacity: 20,
  });

  expect(readExternalArgs(ob)).toEqual({
    hashMapLoadFactor: 10,
    arrayAdditionalAllocation: 5,
    hashMapMinInitialCapacity: 20,
  });
});
