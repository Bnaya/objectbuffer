export interface Edge {
  from: number;
  to: number;
  specialLabel?: string;
}

export interface Node<TType extends string, TValue> {
  type: TType;
  size: number;
  pointer: number;
  refCount?: number;
  specialLabel?: string;
  value?: TValue;
}

export interface MemoryGraph {
  nodes: Array<
    | NodeUndefined
    | NodeNull
    | NodeTrue
    | NodeFalse
    | NodeNumber
    | NodeString
    | NodeStringData
    | NodeBigintPositive
    | NodeBigintNegative
    | NodeDate
    | NodeArray
    | NodeArrayPointers
    | NodeObject
    | NodeMap
    | NodeSet
    | NodeHashmap
    | NodeHashmapNode
    | NodeHashmapBuckets
    | NodeLinkedList
    | NodeLinkedListItem
  >;
  edges: Edge[];
}

export type NodeType = MemoryGraph["nodes"][0]["type"];

// These always points to static memory
type NodeUndefined = Node<"undefined", undefined>;
type NodeNull = Node<"null", null>;
type NodeTrue = Node<"true", true>;
type NodeFalse = Node<"true", false>;

type NodeNumber = Node<"number", number>;
type NodeString = Node<"string", string>;
type NodeStringData = Node<"stringData", string>;

type NodeBigintPositive = Node<"bigintPositive", bigint>;
type NodeBigintNegative = Node<"bigintNegative", bigint>;

type NodeDate = Node<"date", Date>;

type NodeArray = Node<"array", Array<unknown>>;
type NodeArrayPointers = Node<"arrayPointers", unknown>;

type NodeObject = Node<"object", unknown>;
type NodeMap = Node<"map", unknown>;
type NodeSet = Node<"set", unknown>;

type NodeHashmap = Node<"hashmap", unknown>;
type NodeHashmapBuckets = Node<"hashmapBuckets", unknown>;
type NodeHashmapNode = Node<"hashmapNode", unknown>;

type NodeLinkedList = Node<"linkedList", unknown>;
type NodeLinkedListItem = Node<"linkedListItem", unknown>;
