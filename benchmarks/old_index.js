// @ts-check
/* eslint-env node */
/* global globalThis */
/* eslint-disable @typescript-eslint/no-var-requires */

const objectBuffer = require("../");
const objectBufferPrev = require("objectbuffer0100");
const Benchmark = require("benchmark");
const util = require("util");

globalThis.externalArgs = {
  textEncoder: new util.TextEncoder(),
  textDecoder: new util.TextDecoder()
};

// makeCreationSuite(objectBuffer, "tip");
// makeCreationSuite(objectBufferPrev, "objectbuffer0100");

makeAssignmentSuite();

/**
 * @param {any} theModule
 * @param {string} variant
 */
function makeCreationSuite(theModule, variant) {
  const creationWithObjects = new Benchmark.Suite(
    "Creation with objects: " + variant
  );

  creationWithObjects
    .add("Empty Creation", () => {
      theModule.createObjectBuffer(globalThis.externalArgs, 1024, {});
    })
    .add("Tiny object", () => {
      theModule.createObjectBuffer(globalThis.externalArgs, 1024, { a: 1 });
    })
    .add("Tiny nested object", () => {
      theModule.createObjectBuffer(globalThis.externalArgs, 1024, {
        a: { a: 1 }
      });
    })
    .add("Tiny nested object * 2", () => {
      theModule.createObjectBuffer(globalThis.externalArgs, 1024, {
        a: { a: { a: 1 } }
      });
    })
    .on("cycle", function(event) {
      console.log(String(event.target));
    })
    .on("complete", function() {
      console.log("complete", this.name);
    });

  creationWithObjects.run({
    async: false
  });
}

function makeAssignmentSuite() {
  // make eslint shut up :P

  globalThis.currentModule = objectBuffer;

  let ob;

  function setup() {
    const ob = globalThis.currentModule.createObjectBuffer(
      globalThis.externalArgs,
      5048,
      {
        foo: undefined
      }
    );
  }

  const baseSuite = new Benchmark.Suite("base suite name", {});

  baseSuite
    .add(
      "Empty Creation",
      function() {
        ob.foo = {};
      },
      { setup }
    )
    .add(
      "Tiny object",
      function() {
        ob.foo = { a: 1 };
      },
      { setup }
    )
    .add(
      "Tiny nested object",
      function() {
        ob.foo = { a: { a: 1 } };
      },
      { setup }
    )
    .add(
      "Tiny nested object * 2",
      function() {
        ob.foo = {
          a: { a: { a: 1 } }
        };
      },
      { setup }
    )
    .on("cycle", function(event) {
      console.log(String(event.target));
    })
    .on("complete", function() {
      console.log("complete", this.name);
    });

  const suiteTip = baseSuite.clone({
    name: "Assignment Suite TIP"
  });

  suiteTip.run({
    async: false
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  globalThis.currentModule = objectBufferPrev;

  const suitePrev = baseSuite.clone({
    name: "Assignment Suite Old"
  });

  suitePrev.run({
    async: true
  });
}
