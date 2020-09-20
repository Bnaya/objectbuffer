/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-namespace */
import {
  createObjectBuffer,
  // getUnderlyingArrayBuffer,
  // loadObjectBuffer,
} from "../src";

declare global {
  module NodeJS {
    interface Global {
      testTargetIndex: number;
      testTargets: any[];
    }
  }
}

// // @ts-expect-error we test against dist
// import { createObjectBuffer } from "../dist/objectbuffer.cjs.js";

import { Suite } from "benchmark";
// @ts-expect-error arbitrary json
import oneComment from "./fixtures/oneComment.json";
// @ts-expect-error arbitrary json
import K1000RowsMockData from "./fixtures/MOCK_DATA.json";

const EXPECTED_MAX_ITERATIONS = 1000;
const COMMENTS_ARR_SIZE = 2500;
const MIN_SAMPLES = 5;
const arrOfComments = Array.from({ length: COMMENTS_ARR_SIZE }, () => ({
  ...oneComment,
}));

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

const OB_WITH_ABC_KEYS = createObjectBuffer({}, 1e4, objWithABCKeys);
const OB_WITH_NA2Z_KEYS = createObjectBuffer({}, 1e4, objWithNA2ZKeys);
const OB_WITH_AK1000RowsMockData = createObjectBuffer({}, 1e6, {
  K1000RowsMockData,
});

const OB_ARR_WITH_AK1000RowsMockData =
  OB_WITH_AK1000RowsMockData.K1000RowsMockData;

const suite = createSuite();

suite.run();

global.testTargetIndex = 0;
global.testTargets = [];

function createSuite() {
  const suite = new Suite();

  suite
    .add(
      `create empty, size: 1e6`,
      () => {
        createObjectBuffer({}, 1e6, {});
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `create with ${COMMENTS_ARR_SIZE} comments. size: 1e6`,
      () => {
        createObjectBuffer({}, 1e6, {
          arrOfComments,
        });
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
    .add(
      `save ${COMMENTS_ARR_SIZE} comments into pre-created OB, size: 1e6`,
      () => {
        // use pre created object buffer
        global.testTargets[
          global.testTargetIndex
        ].arrOfComments = arrOfComments;

        global.testTargetIndex += 1;
      },
      {
        minSamples: MIN_SAMPLES,
        /**
         * pre-create empty object buffers
         */
        onStart() {
          global.testTargetIndex = 0;
          global.testTargets = [];

          for (let i = 0; i < EXPECTED_MAX_ITERATIONS; i++) {
            global.testTargets.push(createObjectBuffer({}, 1e6, {}));
          }

          if (typeof global.gc !== "undefined") {
            global.gc();
          }
        },
        onComplete() {
          global.testTargetIndex = 0;
          global.testTargets = [];
          if (typeof global.gc !== "undefined") {
            global.gc();
          }
        },
      }
    )
    .add(
      `create with all mock data rows. size: 1e6`,
      () => {
        createObjectBuffer<any>({}, 1e6, { K1000RowsMockData });
      },
      {
        minSamples: MIN_SAMPLES,
      }
    )
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

  return suite;
}
