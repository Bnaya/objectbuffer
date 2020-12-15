/* eslint-env jest */

import { createObjectBuffer } from "../api";
import {
  nodesWithInternalMismatchRefCount,
  getGraphForObjectBuffer,
  jestExpectNoUseAfterFree,
} from "./memoryGraphHelpers";
describe("createMemoryGraph. snapshot graph and ensure memory", () => {
  test("basic", () => {
    const sameObject = { t: 6 };
    const ob = createObjectBuffer(1024 * 10, {
      a: 1,
      b: { t: undefined, t2: null },
      c: true,
      t: BigInt("-1"),
      ar: [1, 666, 3, 4],
      m: new Map([[1, "a"]]),
      s: new Set([6, 7, 8, 9]),
      date: new Date("1-1-2020"),
      sameObject0: sameObject,
      sameObject1: sameObject,
      sameObject2: sameObject,
      sameObject3: sameObject,
      sameObject4: sameObject,
    });

    const { graph, visitedPointers } = getGraphForObjectBuffer(ob);

    expect(graph.nodes).toMatchSnapshot("nodes");
    expect(graph.edges).toMatchSnapshot("edges");
    expect(visitedPointers).toMatchSnapshot("visitedPointers");

    jestExpectNoUseAfterFree(ob);

    expect(nodesWithInternalMismatchRefCount(graph)).toMatchInlineSnapshot(`
      Array [
        Object {
          "pointer": 64,
          "refCount": 2,
          "size": 16,
          "type": "object",
        },
      ]
    `);
  });
});
