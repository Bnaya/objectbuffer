import type { createObjectBuffer as createObjectBufferType } from "../src";

import { Suite } from "benchmark";

// @ts-expect-error arbitrary json
import K1000RowsMockData from "./fixtures/MOCK_DATA.json";

const MIN_SAMPLES = 5;

export function lookupsSuite(
  createObjectBuffer: typeof createObjectBufferType
) {
  const ABCArr = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(i + "A".charCodeAt(0))
  );

  const objWithABCKeys = Object.fromEntries(
    ABCArr.map((l) => [l, l.charCodeAt(0)])
  );

  // { "0ABCD...Z": 1, ... }
  const objWithNA2ZKeys = Object.fromEntries(
    ABCArr.map((_, index) => [`${index}${ABCArr.join("")}`, 1])
  );

  const OB_WITH_ABC_KEYS = createObjectBuffer(2e4, objWithABCKeys);
  const OB_WITH_NA2Z_KEYS = createObjectBuffer(2e4, objWithNA2ZKeys);
  const OB_WITH_AK1000RowsMockData = createObjectBuffer(2e6, {
    K1000RowsMockData,
  });

  const OB_ARR_WITH_AK1000RowsMockData =
    OB_WITH_AK1000RowsMockData.K1000RowsMockData;

  global.testTargetIndex = 0;
  global.testTargets = [];

  const suite = new Suite("lookupsSuite");

  return suite
    .add(
      `A-Z object keys`,
      () => {
        Object.keys(OB_WITH_ABC_KEYS);
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `A-Z object prop Lookup in operator - non-existing`,
      () => {
        "0" in OB_WITH_ABC_KEYS;
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `A-Z object prop Lookup in operator - existing`,
      () => {
        "Z" in OB_WITH_ABC_KEYS;
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `A-Z object prop access T`,
      () => {
        OB_WITH_ABC_KEYS.T;
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `A-Z object prop access Z`,
      () => {
        OB_WITH_ABC_KEYS.Z;
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `OB_WITH_NA2Z_KEYS object keys`,
      () => {
        Object.keys(OB_WITH_NA2Z_KEYS);
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `OB_WITH_NA2Z_KEYS object prop Lookup in operator - non-existing`,
      () => {
        "14ABCDEFGHIJKLMNOPQRSTUVWXYZ_" in OB_WITH_NA2Z_KEYS;
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `OB_WITH_NA2Z_KEYS object prop Lookup in operator - existing`,
      () => {
        "14ABCDEFGHIJKLMNOPQRSTUVWXYZ" in OB_WITH_NA2Z_KEYS;
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `OB_WITH_NA2Z_KEYS object prop access 14ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
      () => {
        OB_WITH_NA2Z_KEYS["14ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `OB_WITH_NA2Z_KEYS object prop access 3ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
      () => {
        OB_WITH_NA2Z_KEYS["3ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `Array access. length: ${OB_ARR_WITH_AK1000RowsMockData.length}`,
      () => {
        OB_ARR_WITH_AK1000RowsMockData[456];
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .on("cycle", (event: any) => {
      console.log(String(event.target));
    })
    .on("complete", () => {
      //
      // process.toString();
    });
}
