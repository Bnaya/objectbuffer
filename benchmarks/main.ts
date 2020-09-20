/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-namespace */
import { createObjectBuffer } from "../src";

import { savingAndCreatingSuite } from "./savingAndCreatingSuite";
import { lookupsSuite } from "./lookupsSuite";
import { freeAndDisposeSuite } from "./freeAndDisposeSuite";

declare global {
  module NodeJS {
    interface Global {
      testTargetIndex: number;
      testTargets: any[];
    }
  }
}

const suite1 = savingAndCreatingSuite(createObjectBuffer);
const suite2 = lookupsSuite(createObjectBuffer);
const suite3 = freeAndDisposeSuite(createObjectBuffer);

suite1.run();
suite2.run();
suite3.run();
