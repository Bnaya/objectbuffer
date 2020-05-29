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
  hashmapNode_set_all,
  hashmap_ARRAY_POINTER_set,
  hashmap_CAPACITY_set,
  hashmapNode_NEXT_NODE_POINTER_set,
  hashmap_size,
  hashmapNode_size,
  hashmapNode_LINKED_LIST_ITEM_POINTER_get,
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

  // todo: share code with hashMapNodeLookup?
  while (
    iteratedNodePointer !== 0 &&
    !compareStringOrNumberEntriesInPlace(
      carrier.heap,
      hashmapNode_KEY_POINTER_get(heap, iteratedNodePointer),
      keyMemoryEntryPointer
    )
  ) {
    ptrToPtrToSaveTheNodeTo =
      iteratedNodePointer + hashmapNode_NEXT_NODE_POINTER_place;
    iteratedNodePointer = hashmapNode_NEXT_NODE_POINTER_get(
      heap,
      iteratedNodePointer
    );
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
  heap: Heap,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const keyHashCode = hashCodeExternalValue(
    hashmap_CAPACITY_get(heap, mapPointer),
    externalKeyValue
  );

  const bucketStartPtrToPtr =
    hashmap_ARRAY_POINTER_get(heap, mapPointer) +
    keyHashCode * Uint32Array.BYTES_PER_ELEMENT;

  let ptrToPtr = bucketStartPtrToPtr;
  let iteratedNode =
    heap.Uint32Array[bucketStartPtrToPtr / Uint32Array.BYTES_PER_ELEMENT];

  while (iteratedNode !== 0) {
    const keyValue = readNumberOrString(
      heap,
      hashmapNode_KEY_POINTER_get(heap, iteratedNode)
    );

    if (keyValue === externalKeyValue) {
      return ptrToPtr;
    }

    ptrToPtr = iteratedNode + hashmapNode_NEXT_NODE_POINTER_place;
    iteratedNode = hashmapNode_NEXT_NODE_POINTER_get(heap, iteratedNode);
  }

  return 0;
}

export function hashMapValueLookup(
  heap: Heap,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const nodePtrToPtr = hashMapNodeLookup(heap, mapPointer, externalKeyValue);

  if (nodePtrToPtr === 0) {
    return 0;
  }

  return (
    heap.Uint32Array[nodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT] +
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
  const { heap, allocator } = carrier;
  const foundNodePtrToPtr = hashMapNodeLookup(
    heap,
    mapPointer,
    externalKeyValue
  );

  if (foundNodePtrToPtr === 0) {
    return 0;
  }

  const nodeToDeletePointer =
    heap.Uint32Array[foundNodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT];
  const valuePointer = nodeToDeletePointer + hashmapNode_VALUE_POINTER_place;

  linkedListItemRemove(
    carrier,
    hashmapNode_LINKED_LIST_ITEM_POINTER_get(heap, nodeToDeletePointer)
  );

  // remove node from bucket
  heap.Uint32Array[
    foundNodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT
  ] = hashmapNode_NEXT_NODE_POINTER_get(heap, nodeToDeletePointer);

  if (
    typeOnly_type_get(
      heap,
      hashmapNode_KEY_POINTER_get(heap, nodeToDeletePointer)
    ) === ENTRY_TYPE.STRING
  ) {
    allocator.free(
      string_charsPointer_get(
        heap,
        hashmapNode_KEY_POINTER_get(heap, nodeToDeletePointer)
      )
    );
  }

  allocator.free(hashmapNode_KEY_POINTER_get(heap, nodeToDeletePointer));
  allocator.free(nodeToDeletePointer);

  hashmap_LINKED_LIST_SIZE_set(
    heap,
    mapPointer,
    hashmap_LINKED_LIST_SIZE_get(heap, mapPointer) - 1
  );

  return valuePointer;
}

/**
 *
 * return pointer to the next node
 */
export function hashMapLowLevelIterator(
  heap: Heap,
  mapPointer: number,
  nodePointerIteratorToken: number
) {
  let tokenToUseForLinkedListIterator = 0;

  if (nodePointerIteratorToken !== 0) {
    tokenToUseForLinkedListIterator = hashmapNode_LINKED_LIST_ITEM_POINTER_get(
      heap,
      nodePointerIteratorToken
    );
  }

  const pointerToNextLinkedListItem = linkedListLowLevelIterator(
    heap,
    hashmap_LINKED_LIST_POINTER_get(heap, mapPointer),
    tokenToUseForLinkedListIterator
  );

  if (pointerToNextLinkedListItem === 0) {
    return 0;
  }

  return linkedListGetValue(heap, pointerToNextLinkedListItem);
}

export function hashMapNodePointerToKeyValue(heap: Heap, nodePointer: number) {
  // @todo avoid intermediate object
  return {
    valuePointer: nodePointer + hashmapNode_VALUE_POINTER_place,
    keyPointer: hashmapNode_KEY_POINTER_get(heap, nodePointer),
  };
}

export function hashMapSize(heap: Heap, mapPointer: number) {
  return hashmap_LINKED_LIST_SIZE_get(heap, mapPointer);
}

export function hashMapGetPointersToFree(heap: Heap, hashmapPointer: number) {
  const pointers: number[] = [
    hashmapPointer,
    hashmap_ARRAY_POINTER_get(heap, hashmapPointer),
  ];
  const pointersToValuePointers: number[] = [];

  const pointersOfLinkedList = linkedListGetPointersToFree(
    heap,
    hashmap_LINKED_LIST_POINTER_get(heap, hashmapPointer)
  );

  pointers.push(...pointersOfLinkedList.pointers);

  for (const nodePointer of pointersOfLinkedList.valuePointers) {
    pointersToValuePointers.push(nodePointer + hashmapNode_VALUE_POINTER_place);
    if (
      typeOnly_type_get(
        heap,
        hashmapNode_KEY_POINTER_get(heap, nodePointer)
      ) === ENTRY_TYPE.STRING
    ) {
      pointers.push(
        string_charsPointer_get(
          heap,
          hashmapNode_KEY_POINTER_get(heap, nodePointer)
        )
      );
    }
    pointers.push(nodePointer, hashmapNode_KEY_POINTER_get(heap, nodePointer));
  }

  // @todo avoid intermediate object
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

  // Why not realloc?
  allocator.free(hashmap_ARRAY_POINTER_get(heap, hashmapPointer));
  const biggerArray = carrier.allocator.calloc(
    newCapacity * Uint32Array.BYTES_PER_ELEMENT
  );

  hashmap_ARRAY_POINTER_set(heap, hashmapPointer, biggerArray);
  hashmap_CAPACITY_set(heap, hashmapPointer, newCapacity);

  let pointerToNode = 0;
  while (
    (pointerToNode = hashMapLowLevelIterator(
      heap,
      hashmapPointer,
      pointerToNode
    )) !== 0
  ) {
    hashMapRehashInsert(heap, biggerArray, newCapacity, pointerToNode);
  }
}

function hashMapRehashInsert(
  heap: Heap,
  bucketsArrayPointer: number,
  arraySize: number,
  nodePointer: number
) {
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

export function* hashmapNodesPointerIterator(heap: Heap, mapPointer: number) {
  let iteratorToken = 0;

  while (
    (iteratorToken = hashMapLowLevelIterator(
      heap,
      mapPointer,
      iteratorToken
    )) !== 0
  ) {
    yield iteratorToken;
  }
}