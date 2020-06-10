import { MemoryGraph } from "./types";
import { getInternalAPI } from "../utils";
import {
  createMemoryGraph,
  mergeGraphsNoIntersections,
} from "./createMemoryGraph";
import { MemPoolWithTricks } from "./allocatorHelpers";

export function nodesWithInternalMismatchRefCount(graph: MemoryGraph) {
  const withRefCount = graph.nodes.filter((n) => n.refCount !== undefined);

  const withMismatcRefCount = withRefCount.filter(
    (node) =>
      node.refCount !== graph.edges.filter((e) => e.to === node.pointer).length
  );

  return withMismatcRefCount;
}

export function getGraphForObjectBuffer(ob: unknown) {
  const internalApi = getInternalAPI(ob);

  const entryPointer = internalApi.getEntryPointer();

  return createMemoryGraph(internalApi.getCarrier().heap, entryPointer);
}

export function jestExpectNoUseAfterFree(ob: unknown) {
  const { graph } = getGraphForObjectBuffer(ob);
  const dataFromAllocator = getAllAllocatedPointers(ob);
  expect(graph.nodes.map((n) => n.pointer).sort()).toEqual(
    dataFromAllocator.map((p) => p.pointer).sort()
  );

  expect(graph.nodes.length).toBe(dataFromAllocator.length);
}

export function jestExpectNoUseAfterFreeSubset(ob: unknown) {
  const { graph } = getGraphForObjectBuffer(ob);
  const dataFromAllocator = getAllAllocatedPointers(ob);

  expect(dataFromAllocator.map((p) => p.pointer).sort()).toEqual(
    expect.arrayContaining(graph.nodes.map((n) => n.pointer).sort())
  );
}

export function jestExpectNoUseAfterFreePartsAreEqulesTheWhole(
  parts: unknown[]
) {
  const graphs = parts.map((p) => getGraphForObjectBuffer(p).graph);

  const mergeGraphs = mergeGraphsNoIntersections(graphs);

  const dataFromAllocator = getAllAllocatedPointers(parts[0]);

  expect(dataFromAllocator.map((p) => p.pointer).sort()).toEqual(
    mergeGraphs.nodes.map((n) => n.pointer).sort()
  );
}

export function getAllAllocatedPointers(ob: unknown) {
  const internalApi = getInternalAPI(ob);

  return MemPoolWithTricks.prototype.listAllAllocatedPointers.apply(
    internalApi.getCarrier().allocator
  );
}
