/* istanbul ignore file */

import { MemoryGraph, NodeType } from "./types";
import { Heap } from "../../structsGenerator/consts";
import {
  typeAndRc_refsCount_get,
  string_size,
  number_size,
  object_size,
  bigint_size,
  array_size,
  hashmap_size,
  hashmapNode_size,
  linkedList_size,
  linkedListItem_size,
  string_charsPointer_get,
  string_bytesLength_get,
  array_dataspacePointer_get,
  array_allocatedLength_get,
  typeOnly_type_get,
  hashmap_ARRAY_POINTER_get,
  hashmap_CAPACITY_get,
  hashmap_LINKED_LIST_POINTER_get,
  hashmapNode_KEY_POINTER_get,
  hashmapNode_LINKED_LIST_ITEM_POINTER_get,
  hashmapNode_VALUE_POINTER_get,
  object_pointerToHashMap_get,
  linkedList_END_POINTER_get,
  linkedListItem_VALUE_get,
} from "../generatedStructs";
import { isKnownAddressValuePointer, createKnownTypeGuard } from "../utils";
import { ENTRY_TYPE } from "../entry-types";
import { assertNonNull } from "../assertNonNull";
import { hashmapNodesPointerIterator } from "../hashmap/hashmap";
import { linkedListLowLevelIterator } from "../linkedList/linkedList";

/**
  side notes:
  blocks with dynamic size:

  * string data space
  * arrays pointers space
  * hashmap buckets array space
*/

/**
 */
export function createMemoryGraph(
  heap: Heap,
  startPointer: number
): { graph: MemoryGraph; visitedPointers: Set<number> } {
  const graph: MemoryGraph = {
    nodes: [],
    edges: [],
  };

  const visitedPointers = new Set<number>();

  const entryTypeOfElement = typeOnly_type_get(heap, startPointer);
  const typeOfElement = entryTypeToNodeType(entryTypeOfElement);

  visitPointerIteration(
    heap,
    startPointer,
    typeOfElement,
    null,
    visitedPointers,
    graph
  );

  if (graph.nodes.length !== visitedPointers.size) {
    throw new Error("graph.nodes.length must be === visitedPointers.size");
  }

  return { graph, visitedPointers };
}

function visitPointerIteration(
  heap: Heap,
  pointer: number,
  typeOfNode: MemoryGraph["nodes"][0]["type"],
  sizeOfBlock: number | null,
  visitedPointers: Set<number>,
  graph: MemoryGraph
) {
  if (isKnownAddressValuePointer(pointer)) {
    return;
  }

  if (visitedPointers.has(pointer)) {
    return;
  }

  visitedPointers.add(pointer);

  // const entryType = typeOnly_type_get(heap, pointer);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const refCount = isTypeWithRC(typeOfNode)
    ? typeAndRc_refsCount_get(heap, pointer)
    : undefined;

  switch (typeOfNode) {
    case "string":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: string_size,
        refCount,
      });
      graph.edges.push({
        from: pointer,
        to: string_charsPointer_get(heap, pointer),
      });
      visitPointerIteration(
        heap,
        string_charsPointer_get(heap, pointer),
        "stringData",
        string_bytesLength_get(heap, pointer),
        visitedPointers,
        graph
      );
      break;
    case "number":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: number_size,
        refCount,
      });
      break;
    case "undefined":
      graph.nodes.push({ type: typeOfNode, pointer, size: 0, refCount });
      break;
    case "null":
      graph.nodes.push({ type: typeOfNode, pointer, size: 0, refCount });
      break;
    case "true":
      graph.nodes.push({ type: typeOfNode, pointer, size: 0, refCount });
      break;
    case "stringData":
      assertNonNull(sizeOfBlock);
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: sizeOfBlock,
        refCount,
      });
      break;
    case "bigintPositive":
    case "bigintNegative":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: bigint_size,
        refCount,
      });
      break;
    case "date":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: bigint_size,
        refCount,
      });
      break;
    case "array":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: array_size,
        refCount,
      });
      graph.edges.push({
        from: pointer,
        to: array_dataspacePointer_get(heap, pointer),
      });
      visitPointerIteration(
        heap,
        array_dataspacePointer_get(heap, pointer),
        "arrayPointers",
        array_allocatedLength_get(heap, pointer) *
          Uint32Array.BYTES_PER_ELEMENT,
        visitedPointers,
        graph
      );
      break;
    case "arrayPointers":
      assertNonNull(sizeOfBlock);
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: sizeOfBlock,
        refCount,
      });

      // Maybe pass also array length and not only allocated length
      for (let i = 0; i < sizeOfBlock; i += Uint32Array.BYTES_PER_ELEMENT) {
        const pointerToElement =
          heap.Uint32Array[(pointer + i) / Uint32Array.BYTES_PER_ELEMENT];

        const entryTypeOfElement = typeOnly_type_get(heap, pointerToElement);
        const typeOfElement = entryTypeToNodeType(entryTypeOfElement);

        graph.edges.push({
          from: pointer,
          to: pointerToElement,
        });

        visitPointerIteration(
          heap,
          pointerToElement,
          typeOfElement,
          null,
          visitedPointers,
          graph
        );
      }

      break;
    case "object":
    case "map":
    case "set":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: object_size,
        refCount,
      });

      graph.edges.push({
        from: pointer,
        to: object_pointerToHashMap_get(heap, pointer),
      });

      visitPointerIteration(
        heap,
        object_pointerToHashMap_get(heap, pointer),
        "hashmap",
        null,
        visitedPointers,
        graph
      );
      break;

    case "hashmap":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: hashmap_size,
        refCount,
      });

      visitPointerIteration(
        heap,
        hashmap_ARRAY_POINTER_get(heap, pointer),
        "hashmapBuckets",
        hashmap_CAPACITY_get(heap, pointer) * Uint32Array.BYTES_PER_ELEMENT,
        visitedPointers,
        graph
      );

      graph.edges.push({
        from: pointer,
        to: hashmap_ARRAY_POINTER_get(heap, pointer),
      });

      visitPointerIteration(
        heap,
        hashmap_LINKED_LIST_POINTER_get(heap, pointer),
        "linkedList",
        null,
        visitedPointers,
        graph
      );

      graph.edges.push({
        from: pointer,
        to: hashmap_LINKED_LIST_POINTER_get(heap, pointer),
      });
      for (const nodePointer of hashmapNodesPointerIterator(heap, pointer)) {
        // Not accurate, as nodes are not referenced directly by the hashmap,
        // But hashmap -> buckets list -> bucket[x] => node1->node2 etc
        // We have something simplified

        graph.edges.push({
          from: pointer,
          to: nodePointer,
        });

        visitPointerIteration(
          heap,
          nodePointer,
          "hashmapNode",
          null,
          visitedPointers,
          graph
        );
      }

      break;

    case "hashmapBuckets":
      assertNonNull(sizeOfBlock);
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: sizeOfBlock,
        refCount,
      });
      break;

    case "hashmapNode":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: hashmapNode_size,
        refCount,
      });

      // key
      visitPointerIteration(
        heap,
        hashmapNode_KEY_POINTER_get(heap, pointer),
        entryTypeToNodeType(
          typeOnly_type_get(heap, hashmapNode_KEY_POINTER_get(heap, pointer))
        ),
        null,
        visitedPointers,
        graph
      );

      graph.edges.push({
        from: pointer,
        to: hashmapNode_KEY_POINTER_get(heap, pointer),
      });

      // linked list item
      visitPointerIteration(
        heap,
        hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, pointer),
        "linkedListItem",
        null,
        visitedPointers,
        graph
      );

      graph.edges.push({
        from: pointer,
        to: hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, pointer),
      });

      // value
      visitPointerIteration(
        heap,
        hashmapNode_VALUE_POINTER_get(heap, pointer),
        entryTypeToNodeType(
          typeOnly_type_get(heap, hashmapNode_VALUE_POINTER_get(heap, pointer))
        ),
        null,
        visitedPointers,
        graph
      );

      graph.edges.push({
        from: pointer,
        to: hashmapNode_VALUE_POINTER_get(heap, pointer),
      });

      break;

    case "linkedList":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: linkedList_size,
        refCount,
      });

      // eslint-disable-next-line no-case-declarations
      let linkedListItemIterator = 0;

      while (
        (linkedListItemIterator = linkedListLowLevelIterator(
          heap,
          pointer,
          linkedListItemIterator
        )) !== 0
      ) {
        if (linkedListItemIterator === undefined) {
          throw new Error("WTF");
        }

        graph.edges.push({
          from: pointer,
          to: linkedListItemIterator,
        });
        visitPointerIteration(
          heap,
          linkedListItemIterator,
          "linkedListItem",
          null,
          visitedPointers,
          graph
        );
      }

      // end marker
      visitPointerIteration(
        heap,
        linkedList_END_POINTER_get(heap, pointer),
        "linkedListItem",
        null,
        visitedPointers,
        graph
      );
      graph.edges.push({
        from: pointer,
        to: linkedList_END_POINTER_get(heap, pointer),
        specialLabel: "linkedlist end marker",
      });

      break;

    case "linkedListItem":
      graph.nodes.push({
        type: typeOfNode,
        pointer,
        size: linkedListItem_size,
        refCount,
      });

      // The value is always hashmap node atm
      visitPointerIteration(
        heap,
        linkedListItem_VALUE_get(heap, pointer),
        "hashmapNode",
        null,
        visitedPointers,
        graph
      );

      graph.edges.push({
        from: pointer,
        to: linkedListItem_VALUE_get(heap, pointer),
      });
      break;
  }
}

const isTypeWithRC = createKnownTypeGuard([
  "string",
  "array",
  "object",
  "set",
  "map",
  "date",
]);

const nodeEntryToType = {
  [ENTRY_TYPE.BIGINT_NEGATIVE]: "bigintNegative",
  [ENTRY_TYPE.BIGINT_POSITIVE]: "bigintPositive",
  [ENTRY_TYPE.ARRAY]: "array",
  [ENTRY_TYPE.MAP]: "map",
  [ENTRY_TYPE.SET]: "set",
  [ENTRY_TYPE.OBJECT]: "object",
  [ENTRY_TYPE.STRING]: "string",
  [ENTRY_TYPE.NUMBER]: "number",
  [ENTRY_TYPE.DATE]: "date",
} as const;

function entryTypeToNodeType(entryType: ENTRY_TYPE): NodeType {
  return nodeEntryToType[entryType];
}

export function mergeGraphs(
  graphA: MemoryGraph,
  graphB: MemoryGraph
): MemoryGraph {
  return {
    nodes: [...graphA.nodes, ...graphB.nodes],
    edges: [...graphA.edges, ...graphB.edges],
  };
}

export function mergeGraphsNoIntersections(graphs: MemoryGraph[]): MemoryGraph {
  const fullPointers = graphs
    .map((graph) => graph.nodes.map((n) => n.pointer))
    .flat();

  const pointers = new Set(fullPointers);

  const fullEdgesList = graphs
    .map((graph) => graph.edges.map((e) => `${e.from}-${e.to}`))
    .flat();

  const edges = new Set(fullEdgesList);

  if (pointers.size !== fullPointers.length) {
    throw new Error("There are intersections in nodes");
  }

  if (edges.size !== fullEdgesList.length) {
    throw new Error("There are intersections edges");
  }

  return {
    nodes: graphs.map((g) => g.nodes).flat(),
    edges: graphs.map((g) => g.edges).flat(),
  };
}
