import { MemoryGraph, Node } from "./types";
import { getInternalAPI } from "../utils";
import {
  createMemoryGraph,
  mergeGraphsNoIntersections,
} from "./createMemoryGraph";
import { MemPoolWithTricks } from "./allocatorHelpers";

export function nodesWithInternalMismatchRefCount(
  graph: MemoryGraph
): (
  | Node<"undefined", undefined>
  | Node<"null", null>
  | Node<"true", true>
  | Node<"true", false>
  | Node<"number", number>
  | Node<"string", string>
  | Node<"stringData", string>
  | Node<"bigintPositive", bigint>
  | Node<"bigintNegative", bigint>
  | Node<"date", Date>
  | Node<"array", unknown[]>
  | Node<"arrayPointers", unknown>
  | Node<"object", unknown>
  | Node<"map", unknown>
  | Node<"set", unknown>
  | Node<"hashmap", unknown>
  | Node<"hashmapNode", unknown>
  | Node<"hashmapBuckets", unknown>
  | Node<"linkedList", unknown>
  | Node<"linkedListItem", unknown>
)[] {
  const withRefCount = graph.nodes.filter((n) => n.refCount !== undefined);

  const withMismatcRefCount = withRefCount.filter(
    (node) =>
      node.refCount !== graph.edges.filter((e) => e.to === node.pointer).length
  );

  return withMismatcRefCount;
}

export function getGraphForObjectBuffer(ob: unknown): {
  graph: MemoryGraph;
  visitedPointers: Set<number>;
} {
  const internalApi = getInternalAPI(ob);

  const entryPointer = internalApi.getEntryPointer();

  return createMemoryGraph(internalApi.getCarrier().heap, entryPointer);
}

export function jestExpectNoUseAfterFree(ob: unknown): void {
  const { graph } = getGraphForObjectBuffer(ob);
  const dataFromAllocator = getAllAllocatedPointers(ob);
  expect(graph.nodes.map((n) => n.pointer).sort()).toEqual(
    dataFromAllocator.map((p) => p.pointer).sort()
  );

  expect(graph.nodes.length).toBe(dataFromAllocator.length);
}

export function jestExpectNoUseAfterFreeSubset(ob: unknown): void {
  const { graph } = getGraphForObjectBuffer(ob);
  const dataFromAllocator = getAllAllocatedPointers(ob);

  expect(dataFromAllocator.map((p) => p.pointer).sort()).toEqual(
    expect.arrayContaining(graph.nodes.map((n) => n.pointer).sort())
  );
}

export function jestExpectNoUseAfterFreePartsAreEqulesTheWhole(
  parts: unknown[]
): void {
  const graphs = parts.map((p) => getGraphForObjectBuffer(p).graph);

  const mergeGraphs = mergeGraphsNoIntersections(graphs);

  const dataFromAllocator = getAllAllocatedPointers(parts[0]);

  expect(dataFromAllocator.map((p) => p.pointer).sort()).toEqual(
    mergeGraphs.nodes.map((n) => n.pointer).sort()
  );
}

export function getAllAllocatedPointers(ob: unknown): {
  blockPointer: number;
  pointer: number;
  size: number;
}[] {
  const internalApi = getInternalAPI(ob);

  return MemPoolWithTricks.prototype.listAllAllocatedPointers.apply(
    internalApi.getCarrier().allocator
  );
}
