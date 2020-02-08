import { MAP_MACHINE, NODE_MACHINE } from "./memoryLayout";
import {
  GlobalCarrier,
  ExternalArgs,
  NumberEntry,
  StringEntry
} from "../interfaces";
import {
  hashCodeInPlace,
  hashCodeExternalValue,
  getKeyStartLength
} from "./hashmapUtils";
import { primitiveValueToEntry } from "../utils";
import {
  sizeOfEntry,
  writeEntry,
  readEntry,
  compareStringOrNumberEntriesInPlace
} from "../store";
import { ENTRY_TYPE } from "../entry-types";
import {
  initLinkedList,
  linkedListItemInsert,
  linkedListItemRemove,
  linkedListLowLevelIterator,
  linkedListGetValue,
  linkedListGetPointersToFree
} from "../linkedList/linkedList";

import { MemoryOperator } from "../memoryMachinery";

export function createHashMap(
  carrier: GlobalCarrier,
  /**
   * number of buckets
   */
  initialCapacity = 10
) {
  const hashMapMemory = carrier.allocator.calloc(MAP_MACHINE.map.SIZE_OF);
  const arrayMemory = carrier.allocator.calloc(
    initialCapacity * Uint32Array.BYTES_PER_ELEMENT
  );

  const linkedListPointer = initLinkedList(carrier);

  const mapMachine = MAP_MACHINE.createOperator(carrier, hashMapMemory);

  mapMachine.set("ARRAY_POINTER", arrayMemory);
  mapMachine.set("CAPACITY", initialCapacity);
  mapMachine.set("USED_CAPACITY", 0);
  mapMachine.set("LINKED_LIST_POINTER", linkedListPointer);
  mapMachine.set("LINKED_LIST_SIZE", 0);

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
  const mapOperator = MAP_MACHINE.createOperator(carrier, mapPointer);
  const keyEntry = primitiveValueToEntry(externalKeyValue) as
    | NumberEntry
    | StringEntry;

  // allocate all possible needed memory upfront, so we won't oom in the middle of something
  // in case of overwrite, we will not need this memory
  const memoryForNewNode = carrier.allocator.calloc(NODE_MACHINE.map.SIZE_OF);
  const memorySizeOfKey = sizeOfEntry(keyEntry);
  const keyEntryMemory = carrier.allocator.calloc(memorySizeOfKey);

  writeEntry(carrier, keyEntryMemory, keyEntry);

  const keyHeaderOverhead =
    keyEntry.type === ENTRY_TYPE.STRING
      ? // type + string length
        8 + 4
      : // type
        8;
  const keyHashCode = hashCodeInPlace(
    carrier.uint8,
    mapOperator.get("CAPACITY"),
    // + 1 for the type of key
    keyEntryMemory + keyHeaderOverhead,
    memorySizeOfKey - keyHeaderOverhead
  );

  let ptrToPtrToSaveTheNodeTo =
    mapOperator.get("ARRAY_POINTER") +
    keyHashCode * Uint32Array.BYTES_PER_ELEMENT;

  const commonNodeOperator = NODE_MACHINE.createOperator(
    carrier,
    carrier.uint32[ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT]
  );

  // todo: share code with hashMapNodeLookup?
  while (
    commonNodeOperator.startAddress !== 0 &&
    !compareStringOrNumberEntriesInPlace(
      carrier,
      commonNodeOperator.get("KEY_POINTER"),
      keyEntryMemory
    )
  ) {
    ptrToPtrToSaveTheNodeTo = commonNodeOperator.pointerTo("NEXT_NODE_POINTER");
    commonNodeOperator.startAddress = commonNodeOperator.get(
      "NEXT_NODE_POINTER"
    );
  }

  // first item added to bucket
  if (
    ptrToPtrToSaveTheNodeTo ===
    mapOperator.get("ARRAY_POINTER") +
      keyHashCode * Uint32Array.BYTES_PER_ELEMENT
  ) {
    mapOperator.set("USED_CAPACITY", mapOperator.get("USED_CAPACITY") + 1);
  }

  // found node with same key, return same pointer
  if (commonNodeOperator.startAddress !== 0) {
    // we don't need the new memory
    carrier.allocator.free(keyEntryMemory);
    carrier.allocator.free(memoryForNewNode);

    return commonNodeOperator.pointerTo("VALUE_POINTER");
  } else {
    commonNodeOperator.startAddress = memoryForNewNode;
    commonNodeOperator.set("KEY_POINTER", keyEntryMemory);
    commonNodeOperator.set(
      "LINKED_LIST_ITEM_POINTER",
      linkedListItemInsert(
        carrier,
        mapOperator.get("LINKED_LIST_POINTER"),
        memoryForNewNode
      )
    );

    carrier.uint32[
      ptrToPtrToSaveTheNodeTo / Uint32Array.BYTES_PER_ELEMENT
    ] = memoryForNewNode;

    mapOperator.set(
      "LINKED_LIST_SIZE",
      mapOperator.get("LINKED_LIST_SIZE") + 1
    );

    if (
      shouldRehash(
        mapOperator.get("LINKED_LIST_SIZE"),
        mapOperator.get("CAPACITY"),
        mapOperator.get("USED_CAPACITY"),
        externalArgs.hashMapLoadFactor
      )
    ) {
      // console.log("rehash", {
      //   USED_CAPACITY: mapOperator.get("USED_CAPACITY")
      // });
      hashMapRehash(carrier, mapOperator, mapOperator.get("CAPACITY") * 2);
    }

    return commonNodeOperator.pointerTo("VALUE_POINTER");
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
    const keyEntry = readEntry(carrier, node.get("KEY_POINTER")) as
      | NumberEntry
      | StringEntry;

    if (keyEntry.value === externalKeyValue) {
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

  const node = NODE_MACHINE.createOperator(
    carrier,
    carrier.uint32[nodePtrToPtr / Uint32Array.BYTES_PER_ELEMENT]
  );

  return node.pointerTo("VALUE_POINTER");
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
    carrier,
    mapOperator.get("LINKED_LIST_POINTER"),
    tokenToUseForLinkedListIterator
  );

  if (pointerToNextLinkedListItem === 0) {
    return 0;
  }

  return linkedListGetValue(carrier, pointerToNextLinkedListItem);
}

export function hashMapNodePointerToKeyValue(
  carrier: GlobalCarrier,
  nodePointer: number
) {
  const operator = NODE_MACHINE.createOperator(carrier, nodePointer);

  return {
    valuePointer: operator.pointerTo("VALUE_POINTER"),
    keyPointer: operator.get("KEY_POINTER")
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
    carrier,
    mapOperator.get("LINKED_LIST_POINTER")
  );

  pointers.push(...pointersOfLinkedList.pointers);
  const nodeOperator = NODE_MACHINE.createOperator(carrier, 0);

  for (const nodePointer of pointersOfLinkedList.valuePointers) {
    nodeOperator.startAddress = nodePointer;
    pointersToValuePointers.push(nodeOperator.pointerTo("VALUE_POINTER"));
    pointers.push(nodePointer, nodeOperator.get("KEY_POINTER"));
  }

  return {
    pointers,
    pointersToValuePointers
  };
}

function hashMapRehash(
  carrier: GlobalCarrier,
  mapOperator: MemoryOperator<
    | "CAPACITY"
    | "USED_CAPACITY"
    | "ARRAY_POINTER"
    | "LINKED_LIST_POINTER"
    | "LINKED_LIST_SIZE"
  >,
  newCapacity: number
) {
  // const before = {
  //   ARRAY_POINTER: mapOperator.get("ARRAY_POINTER"),
  //   CAPACITY: mapOperator.get("CAPACITY"),
  //   USED_CAPACITY: mapOperator.get("USED_CAPACITY")
  // };

  carrier.allocator.free(mapOperator.get("ARRAY_POINTER"));
  const biggerArray = carrier.allocator.calloc(
    newCapacity * Uint32Array.BYTES_PER_ELEMENT
  );

  // (carrier.allocator as typeof carrier.allocator & { u8: Uint8Array }).u8.fill(
  //   0,
  //   biggerArray,
  //   biggerArray + newCapacity * Uint32Array.BYTES_PER_ELEMENT
  // );

  mapOperator.set("ARRAY_POINTER", biggerArray);
  mapOperator.set("CAPACITY", newCapacity);

  // const after = {
  //   ARRAY_POINTER: mapOperator.get("ARRAY_POINTER"),
  //   CAPACITY: mapOperator.get("CAPACITY"),
  //   USED_CAPACITY: mapOperator.get("USED_CAPACITY")
  // };

  let pointerToNode = 0;
  while (
    (pointerToNode = hashMapLowLevelIterator(
      carrier,
      mapOperator.startAddress,
      pointerToNode
    )) !== 0
  ) {
    hashMapRehashInsert(carrier, biggerArray, newCapacity, pointerToNode);
  }
}

function hashMapRehashInsert(
  carrier: GlobalCarrier,
  bucketsArrayPointer: number,
  arraySize: number,
  nodePointer: number
) {
  const nodeOperator = NODE_MACHINE.createOperator(carrier, nodePointer);
  const keyInfo = getKeyStartLength(carrier, nodeOperator.get("KEY_POINTER"));

  const keyHashCode = hashCodeInPlace(
    carrier.uint8,
    arraySize,
    keyInfo.start,
    keyInfo.length
  );

  const bucket = keyHashCode % arraySize;
  const bucketStartPointer =
    bucketsArrayPointer + bucket * Uint32Array.BYTES_PER_ELEMENT;

  const prevFirstNodeInBucket =
    carrier.uint32[bucketStartPointer / Uint32Array.BYTES_PER_ELEMENT];

  carrier.uint32[
    bucketStartPointer / Uint32Array.BYTES_PER_ELEMENT
  ] = nodePointer;

  nodeOperator.set("NEXT_NODE_POINTER", prevFirstNodeInBucket);

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
  nodesCount: number,
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
