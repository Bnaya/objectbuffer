// import { MAP_MACHINE, NODE_MACHINE } from "./memoryLayout";
import { GlobalCarrier, ExternalArgs } from "../interfaces";
import {
  hashCodeInPlace,
  hashCodeExternalValue,
  getKeyStart,
  getKeyLength,
} from "./hashmapUtils";
import { strByteLength } from "../utils";
import { stringEncodeInto } from "../stringEncodeInto";
import {
  compareStringOrNumberEntriesInPlace,
  readNumberOrString,
} from "../store";
import { ENTRY_TYPE } from "../entry-types";
import {
  initLinkedList,
  linkedListItemInsert,
  linkedListItemRemove,
  linkedListLowLevelIterator,
  linkedListGetValue,
  linkedListGetPointersToFree,
} from "../linkedList/linkedList";

import {
  number_size,
  string_size,
  number_set_all,
  string_set_all,
  number_value_place,
  number_value_ctor,
  typeOnly_type_get,
  string_charsPointer_get,
  hashmap_set_all,
  hashmap_CAPACITY_get,
  hashmap_ARRAY_POINTER_get,
  hashmap_USED_CAPACITY_set,
  hashmap_USED_CAPACITY_get,
  hashmapNode_KEY_POINTER_get,
  hashmapNode_NEXT_NODE_POINTER_place,
  hashmapNode_NEXT_NODE_POINTER_get,
  hashmapNode_VALUE_POINTER_place,
  hashmap_LINKED_LIST_POINTER_get,
  hashmap_LINKED_LIST_SIZE_set,
  hashmap_LINKED_LIST_SIZE_get,
  hashmapNode_VALUE_POINTER_get,
  hashmapNode_set_all,
  hashmap_ARRAY_POINTER_set,
  hashmap_CAPACITY_set,
  hashmapNode_NEXT_NODE_POINTER_set,
  hashmap_size,
  hashmapNode_size,
} from "../generatedStructs";
import { Heap } from "../../structsGenerator/consts";

export function createHashMap(
  carrier: GlobalCarrier,
  /**
   * number of buckets
   */
  initialCapacity = 10
) {
  const { heap, allocator } = carrier;
  const hashMapMemory = allocator.calloc(hashmap_size);
  const arrayMemory = allocator.calloc(
    initialCapacity * Uint32Array.BYTES_PER_ELEMENT
  );

  const linkedListPointer = initLinkedList(carrier);

  hashmap_set_all(
    heap,
    hashMapMemory,
    arrayMemory,
    linkedListPointer,
    0,
    initialCapacity,
    0
  );

  return hashMapMemory;
}

/**
 * @returns pointer to 32bit you can use.
 */
export function hashMapInsertUpdate(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const { heap, allocator } = carrier;
  // const mapOperator = MAP_MACHINE.createOperator(carrier, mapPointer);

  // allocate all possible needed memory upfront, so we won't oom in the middle of something
  // in case of overwrite, we will not need this memory
  const memoryForNewNode = allocator.calloc(hashmapNode_size);
  let keyMemoryEntryPointer;
  let keyDataMemoryStart: number;
  let keyDataMemoryLength: number;

  if (typeof externalKeyValue === "number") {
    keyMemoryEntryPointer = allocator.calloc(number_size);
    number_set_all(
      carrier.heap,
      keyMemoryEntryPointer,
      ENTRY_TYPE.NUMBER,
      externalKeyValue
    );

    keyDataMemoryStart = keyMemoryEntryPointer + number_value_place;
    keyDataMemoryLength = number_value_ctor.BYTES_PER_ELEMENT;
  } else {
    keyMemoryEntryPointer = allocator.calloc(string_size);
    keyDataMemoryLength = strByteLength(externalKeyValue);
    keyDataMemoryStart = allocator.calloc(keyDataMemoryLength);
    stringEncodeInto(
      carrier.heap.Uint8Array,
      keyDataMemoryStart,
      externalKeyValue
    );

    string_set_all(
      carrier.heap,
      keyMemoryEntryPointer,
      ENTRY_TYPE.STRING,
      keyDataMemoryLength,
      keyDataMemoryStart
    );
  }

  const keyHashCode = hashCodeInPlace(
    heap.Uint8Array,
    hashmap_CAPACITY_get(heap, mapPointer),
    keyDataMemoryStart,
    keyDataMemoryLength
  );

  const bucketStartPointer =
    hashmap_ARRAY_POINTER_get(heap, mapPointer) +
    keyHashCode * Uint32Array.BYTES_PER_ELEMENT;

  let ptrToPtrToSaveTheNodeTo = bucketStartPointer;

  let iteratedNodePointer =
    heap.Uint32Array[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT];

  // const commonNodeOperator = NODE_MACHINE.createOperator(
  //   carrier,
  //   carrier.uint32[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT]
  // );

  // todo: share code with hashMapNodeLookup?
  while (
    iteratedNodePointer !== 0 &&
    !compareStringOrNumberEntriesInPlace(
      carrier.heap,
      hashmapNode_KEY_POINTER_get(heap, iteratedNodePointer),
      keyMemoryEntryPointer
    )
  ) {
    // ptrToPtrToSaveTheNodeTo = commonNodeOperator.pointerTo("NEXT_NODE_POINTER");
    ptrToPtrToSaveTheNodeTo =
      iteratedNodePointer + hashmapNode_NEXT_NODE_POINTER_place;
    iteratedNodePointer = hashmapNode_NEXT_NODE_POINTER_get(
      heap,
      iteratedNodePointer
    );
    // commonNodeOperator.startAddress = commonNodeOperator.get(
    //   "NEXT_NODE_POINTER"
    // );
  }

  // bucket was empty, first item added to bucket
  if (ptrToPtrToSaveTheNodeTo === bucketStartPointer) {
    hashmap_USED_CAPACITY_set(
      heap,
      mapPointer,
      hashmap_USED_CAPACITY_get(heap, mapPointer) + 1
    );
  }

  // found node with same key, return same pointer
  if (iteratedNodePointer !== 0) {
    // we don't need the new memory
    // @todo Free here also the string data
    if (
      typeOnly_type_get(carrier.heap, keyMemoryEntryPointer) ===
      ENTRY_TYPE.STRING
    ) {
      allocator.free(
        string_charsPointer_get(carrier.heap, keyMemoryEntryPointer)
      );
    }

    // we don't need to new memory
    allocator.free(keyMemoryEntryPointer);
    allocator.free(memoryForNewNode);

    // return commonNodeOperator.pointerTo("VALUE_POINTER");
    return iteratedNodePointer + hashmapNode_VALUE_POINTER_place;
  } else {
    iteratedNodePointer = memoryForNewNode;
    hashmapNode_set_all(
      heap,
      iteratedNodePointer,
      0,
      0,
      keyMemoryEntryPointer,
      linkedListItemInsert(
        carrier,
        hashmap_LINKED_LIST_POINTER_get(heap, mapPointer),
        memoryForNewNode
      )
    );
    // commonNodeOperator.set("KEY_POINTER", keyMemoryEntryPointer);
    // commonNodeOperator.set(
    //   "LINKED_LIST_ITEM_POINTER",
    //   linkedListItemInsert(
    //     carrier,
    //     hashmap_LINKED_LIST_POINTER_get(heap, mapPointer),
    //     memoryForNewNode
    //   )
    // );

    heap.Uint32Array[
      ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT
    ] = memoryForNewNode;

    hashmap_LINKED_LIST_SIZE_set(
      heap,
      mapPointer,
      hashmap_LINKED_LIST_SIZE_get(heap, mapPointer) + 1
    );

    if (
      shouldRehash(
        hashmap_CAPACITY_get(heap, mapPointer),
        hashmap_USED_CAPACITY_get(heap, mapPointer),
        externalArgs.hashMapLoadFactor
      )
    ) {
      // console.log("rehash", {
      //   USED_CAPACITY: mapOperator.get("USED_CAPACITY")
      // });
      hashMapRehash(
        carrier,
        mapPointer,
        hashmap_CAPACITY_get(heap, mapPointer) * 2
      );
    }

    return iteratedNodePointer + hashmapNode_VALUE_POINTER_place;
  }
}

/**
 * @returns pointer of the pointer to the found node
 */
export function hashMapNodeLookup(
  carrier: GlobalCarrier,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const mapMachine = MAP_MACHINE.createOperator(carrier, mapPointer);

  const keyHashCode = hashCodeExternalValue(
    mapMachine.get("CAPACITY"),
    externalKeyValue
  );

  let ptrToPtr =
    mapMachine.get("ARRAY_POINTER") +
    keyHashCode * Uint32Array.BYTES_PER_ELEMENT;

  const node = NODE_MACHINE.createOperator(
    carrier,
    carrier.uint32[ptrToPtr / Uint32Array.BYTES_PER_ELEMENT]
  );

  while (node.startAddress !== 0) {
    const keyValue = readNumberOrString(carrier.heap, node.get("KEY_POINTER"));

    if (keyValue === externalKeyValue) {
      return ptrToPtr;
    }

    ptrToPtr = node.pointerTo("NEXT_NODE_POINTER");
    node.startAddress = node.get("NEXT_NODE_POINTER");
  }

  return 0;
}

export function hashMapValueLookup(
  carrier: GlobalCarrier,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const nodePtrToPtr = hashMapNodeLookup(carrier, mapPointer, externalKeyValue);

  if (nodePtrToPtr === 0) {
    return 0;
  }

  return (
    carrier.heap.Uint32Array[nodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT] +
    hashmapNode_VALUE_POINTER_place
  );
}

/**
 * @returns the value pointer of the deleted key
 */
export function hashMapDelete(
  carrier: GlobalCarrier,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const foundNodePtrToPtr = hashMapNodeLookup(
    carrier,
    mapPointer,
    externalKeyValue
  );

  if (foundNodePtrToPtr === 0) {
    return 0;
  }

  const nodeToDeletePointer =
    carrier.uint32[foundNodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT];

  const nodeOperator = NODE_MACHINE.createOperator(
    carrier,
    nodeToDeletePointer
  );

  const valuePointer = nodeOperator.pointerTo("VALUE_POINTER");

  linkedListItemRemove(carrier, nodeOperator.get("LINKED_LIST_ITEM_POINTER"));

  // remove node from bucket
  carrier.uint32[
    foundNodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT
  ] = nodeOperator.get("NEXT_NODE_POINTER");

  if (
    typeOnly_type_get(carrier.heap, nodeOperator.get("KEY_POINTER")) ===
    ENTRY_TYPE.STRING
  ) {
    carrier.allocator.free(
      string_charsPointer_get(carrier.heap, nodeOperator.get("KEY_POINTER"))
    );
  }

  carrier.allocator.free(nodeOperator.get("KEY_POINTER"));
  carrier.allocator.free(nodeOperator.startAddress);

  carrier.uint32[
    (mapPointer + MAP_MACHINE.map.LINKED_LIST_SIZE.bytesOffset) /
      Uint32Array.BYTES_PER_ELEMENT
  ]--;

  return valuePointer;
}

/**
 *
 * return pointer to the next node
 */
export function hashMapLowLevelIterator(
  carrier: GlobalCarrier,
  mapPointer: number,
  nodePointerIteratorToken: number
) {
  const mapOperator = MAP_MACHINE.createOperator(carrier, mapPointer);
  let tokenToUseForLinkedListIterator = 0;

  if (nodePointerIteratorToken !== 0) {
    tokenToUseForLinkedListIterator = NODE_MACHINE.createOperator(
      carrier,
      nodePointerIteratorToken
    ).get("LINKED_LIST_ITEM_POINTER");
  }

  const pointerToNextLinkedListItem = linkedListLowLevelIterator(
    carrier.heap,
    mapOperator.get("LINKED_LIST_POINTER"),
    tokenToUseForLinkedListIterator
  );

  if (pointerToNextLinkedListItem === 0) {
    return 0;
  }

  return linkedListGetValue(carrier.heap, pointerToNextLinkedListItem);
}

export function hashMapNodePointerToKeyValue(
  carrier: GlobalCarrier,
  nodePointer: number
) {
  const operator = NODE_MACHINE.createOperator(carrier, nodePointer);

  return {
    valuePointer: operator.pointerTo("VALUE_POINTER"),
    keyPointer: operator.get("KEY_POINTER"),
  };
}

export function hashMapSize(carrier: GlobalCarrier, mapPointer: number) {
  return carrier.uint32[
    (mapPointer + MAP_MACHINE.map.LINKED_LIST_SIZE.bytesOffset) /
      Uint32Array.BYTES_PER_ELEMENT
  ];
}

export function hashMapGetPointersToFree(
  carrier: GlobalCarrier,
  hashmapPointer: number
) {
  const mapOperator = MAP_MACHINE.createOperator(carrier, hashmapPointer);
  const pointers: number[] = [hashmapPointer, mapOperator.get("ARRAY_POINTER")];
  const pointersToValuePointers: number[] = [];

  const pointersOfLinkedList = linkedListGetPointersToFree(
    carrier.heap,
    mapOperator.get("LINKED_LIST_POINTER")
  );

  pointers.push(...pointersOfLinkedList.pointers);
  const nodeOperator = NODE_MACHINE.createOperator(carrier, 0);

  for (const nodePointer of pointersOfLinkedList.valuePointers) {
    nodeOperator.startAddress = nodePointer;
    pointersToValuePointers.push(nodeOperator.pointerTo("VALUE_POINTER"));
    if (
      typeOnly_type_get(carrier.heap, nodeOperator.get("KEY_POINTER")) ===
      ENTRY_TYPE.STRING
    ) {
      pointers.push(
        string_charsPointer_get(carrier.heap, nodeOperator.get("KEY_POINTER"))
      );
    }
    pointers.push(nodePointer, nodeOperator.get("KEY_POINTER"));
  }

  return {
    pointers,
    pointersToValuePointers,
  };
}

function hashMapRehash(
  carrier: GlobalCarrier,
  hashmapPointer: number,
  newCapacity: number
) {
  const { heap, allocator } = carrier;
  // const before = {
  //   ARRAY_POINTER: mapOperator.get("ARRAY_POINTER"),
  //   CAPACITY: mapOperator.get("CAPACITY"),
  //   USED_CAPACITY: mapOperator.get("USED_CAPACITY")
  // };

  // Why not realloc?
  allocator.free(hashmap_ARRAY_POINTER_get(heap, hashmapPointer));
  const biggerArray = carrier.allocator.calloc(
    newCapacity * Uint32Array.BYTES_PER_ELEMENT
  );

  // (carrier.allocator as typeof carrier.allocator & { u8: Uint8Array }).u8.fill(
  //   0,
  //   biggerArray,
  //   biggerArray + newCapacity * Uint32Array.BYTES_PER_ELEMENT
  // );

  hashmap_ARRAY_POINTER_set(heap, hashmapPointer, biggerArray);
  hashmap_CAPACITY_set(heap, hashmapPointer, newCapacity);

  // mapOperator.set("ARRAY_POINTER", biggerArray);
  // mapOperator.set("CAPACITY", newCapacity);

  // const after = {
  //   ARRAY_POINTER: mapOperator.get("ARRAY_POINTER"),
  //   CAPACITY: mapOperator.get("CAPACITY"),
  //   USED_CAPACITY: mapOperator.get("USED_CAPACITY")
  // };

  let pointerToNode = 0;
  while (
    (pointerToNode = hashMapLowLevelIterator(
      carrier,
      hashmapPointer,
      pointerToNode
    )) !== 0
  ) {
    hashMapRehashInsert(carrier.heap, biggerArray, newCapacity, pointerToNode);
  }
}

function hashMapRehashInsert(
  heap: Heap,
  bucketsArrayPointer: number,
  arraySize: number,
  nodePointer: number
) {
  // const nodeOperator = NODE_MACHINE.createOperator(carrier, nodePointer);

  const keyHashCode = hashCodeInPlace(
    heap.Uint8Array,
    arraySize,
    getKeyStart(heap, nodePointer),
    getKeyLength(heap, nodePointer)
  );

  const bucket = keyHashCode % arraySize;
  const bucketStartPointer =
    bucketsArrayPointer + bucket * Uint32Array.BYTES_PER_ELEMENT;

  const prevFirstNodeInBucket =
    heap.Uint32Array[bucketStartPointer / Uint32Array.BYTES_PER_ELEMENT];

  heap.Uint32Array[
    bucketStartPointer / Uint32Array.BYTES_PER_ELEMENT
  ] = nodePointer;

  hashmapNode_NEXT_NODE_POINTER_set(heap, nodePointer, prevFirstNodeInBucket);
  // nodeOperator.set("NEXT_NODE_POINTER", prevFirstNodeInBucket);

  // // Add is first node in bucket
  // if (nodeOperator.startAddress === 0) {
  //   carrier.dataView.setUint32(bucketStartPointer, nodePointer);
  //   return;
  // }

  // // find last node.
  // while (nodeOperator.get("NEXT_NODE_POINTER") !== 0) {
  //   nodeOperator.startAddress = nodeOperator.get("NEXT_NODE_POINTER");
  // }

  // nodeOperator.set("NEXT_NODE_POINTER", nodePointer);
}

function shouldRehash(
  buckets: number,
  fullBuckets: number,
  loadFactor: number
) {
  // add proportion check?
  // nodesCount
  return fullBuckets / buckets > loadFactor;
}

export function* hashmapNodesPointerIterator(
  carrier: GlobalCarrier,
  mapPointer: number
) {
  let iteratorToken = 0;

  while (
    (iteratorToken = hashMapLowLevelIterator(
      carrier,
      mapPointer,
      iteratorToken
    )) !== 0
  ) {
    yield iteratorToken;
  }
}
