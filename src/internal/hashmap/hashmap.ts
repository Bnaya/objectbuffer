import { MAP_MACHINE, NODE_MACHINE } from "./memoryLayout";
import {
  DataViewAndAllocatorCarrier,
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
  carrier: DataViewAndAllocatorCarrier,
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

  const mapMachine = MAP_MACHINE.createOperator(
    carrier.dataView,
    hashMapMemory
  );

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
  { dataView, allocator }: DataViewAndAllocatorCarrier,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const mapOperator = MAP_MACHINE.createOperator(dataView, mapPointer);
  const keyEntry = primitiveValueToEntry(
    { ...externalArgs, minimumStringAllocation: 0 },
    externalKeyValue,
    0
  ) as NumberEntry | StringEntry;

  // allocate all possible needed memory upfront, so we won't oom in the middle of something
  // in case of overwrite, we will not need this memory
  const memoryForNewNode = allocator.calloc(NODE_MACHINE.map.SIZE_OF);
  const memorySizeOfKey = sizeOfEntry(keyEntry);
  const keyEntryMemory = allocator.calloc(memorySizeOfKey);

  writeEntry(externalArgs, dataView, keyEntryMemory, keyEntry);

  const keyHeaderOverhead = keyEntry.type === ENTRY_TYPE.STRING ? 5 : 1;
  const keyHashCode = hashCodeInPlace(
    dataView,
    mapOperator.get("CAPACITY"),
    // + 1 for the type of key
    keyEntryMemory + keyHeaderOverhead,
    memorySizeOfKey - keyHeaderOverhead
  );

  let ptrToPtrToSaveTheNodeTo =
    mapOperator.get("ARRAY_POINTER") +
    keyHashCode * Uint32Array.BYTES_PER_ELEMENT;

  const commonNodeOperator = NODE_MACHINE.createOperator(
    dataView,
    dataView.getUint32(ptrToPtrToSaveTheNodeTo)
  );

  // todo: share code with hashMapNodeLookup?
  while (
    commonNodeOperator.startAddress !== 0 &&
    !compareStringOrNumberEntriesInPlace(
      dataView,
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
    allocator.free(keyEntryMemory);
    allocator.free(memoryForNewNode);

    return commonNodeOperator.pointerTo("VALUE_POINTER");
  } else {
    commonNodeOperator.startAddress = memoryForNewNode;
    commonNodeOperator.set("KEY_POINTER", keyEntryMemory);
    commonNodeOperator.set(
      "LINKED_LIST_ITEM_POINTER",
      linkedListItemInsert(
        { dataView, allocator },
        mapOperator.get("LINKED_LIST_POINTER"),
        memoryForNewNode
      )
    );

    dataView.setUint32(ptrToPtrToSaveTheNodeTo, memoryForNewNode);

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
      hashMapRehash(
        { dataView, allocator },
        mapOperator,
        mapOperator.get("CAPACITY") * 2
      );
    }

    return commonNodeOperator.pointerTo("VALUE_POINTER");
  }
}

/**
 * @returns pointer of the pointer to the found node
 */
export function hashMapNodeLookup(
  externalArgs: ExternalArgs,
  dataView: DataView,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const mapMachine = MAP_MACHINE.createOperator(dataView, mapPointer);

  const keyHashCode = hashCodeExternalValue(
    externalArgs,
    mapMachine.get("CAPACITY"),
    externalKeyValue
  );

  let ptrToPtr =
    mapMachine.get("ARRAY_POINTER") +
    keyHashCode * Uint32Array.BYTES_PER_ELEMENT;

  const node = NODE_MACHINE.createOperator(
    dataView,
    dataView.getUint32(ptrToPtr)
  );

  while (node.startAddress !== 0) {
    const keyEntry = readEntry(
      externalArgs,
      dataView,
      node.get("KEY_POINTER")
    ) as NumberEntry | StringEntry;

    if (keyEntry.value === externalKeyValue) {
      return ptrToPtr;
    }

    ptrToPtr = node.pointerTo("NEXT_NODE_POINTER");
    node.startAddress = node.get("NEXT_NODE_POINTER");
  }

  return 0;
}

export function hashMapValueLookup(
  externalArgs: ExternalArgs,
  dataView: DataView,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const nodePtrToPtr = hashMapNodeLookup(
    externalArgs,
    dataView,
    mapPointer,
    externalKeyValue
  );

  if (nodePtrToPtr === 0) {
    return 0;
  }

  const node = NODE_MACHINE.createOperator(
    dataView,
    dataView.getUint32(nodePtrToPtr)
  );

  return node.pointerTo("VALUE_POINTER");
}

/**
 * @returns the value pointer of the deleted key
 */
export function hashMapDelete(
  externalArgs: ExternalArgs,
  { dataView, allocator }: DataViewAndAllocatorCarrier,
  mapPointer: number,
  externalKeyValue: number | string
) {
  const foundNodePtrToPtr = hashMapNodeLookup(
    externalArgs,
    dataView,
    mapPointer,
    externalKeyValue
  );

  if (foundNodePtrToPtr === 0) {
    return 0;
  }

  const nodeToDeletePointer = dataView.getUint32(foundNodePtrToPtr);

  const nodeOperator = NODE_MACHINE.createOperator(
    dataView,
    nodeToDeletePointer
  );

  const valuePointer = nodeOperator.pointerTo("VALUE_POINTER");

  linkedListItemRemove(
    { dataView, allocator },
    nodeOperator.get("LINKED_LIST_ITEM_POINTER")
  );

  // remove node from bucket
  dataView.setUint32(foundNodePtrToPtr, nodeOperator.get("NEXT_NODE_POINTER"));

  allocator.free(nodeOperator.get("KEY_POINTER"));
  allocator.free(nodeOperator.startAddress);

  dataView.setUint32(
    mapPointer + MAP_MACHINE.map.LINKED_LIST_SIZE.bytesOffset,
    dataView.getUint32(
      mapPointer + MAP_MACHINE.map.LINKED_LIST_SIZE.bytesOffset
    ) - 1
  );

  return valuePointer;
}

/**
 *
 * return pointer to the next node
 */
export function hashMapLowLevelIterator(
  dataView: DataView,
  mapPointer: number,
  nodePointerIteratorToken: number
) {
  const mapOperator = MAP_MACHINE.createOperator(dataView, mapPointer);
  let tokenToUseForLinkedListIterator = 0;

  if (nodePointerIteratorToken !== 0) {
    tokenToUseForLinkedListIterator = NODE_MACHINE.createOperator(
      dataView,
      nodePointerIteratorToken
    ).get("LINKED_LIST_ITEM_POINTER");
  }

  const pointerToNextLinkedListItem = linkedListLowLevelIterator(
    dataView,
    mapOperator.get("LINKED_LIST_POINTER"),
    tokenToUseForLinkedListIterator
  );

  if (pointerToNextLinkedListItem === 0) {
    return 0;
  }

  return linkedListGetValue(dataView, pointerToNextLinkedListItem);
}

export function hashMapNodePointerToKeyValue(
  dataView: DataView,
  nodePointer: number
) {
  const operator = NODE_MACHINE.createOperator(dataView, nodePointer);

  return {
    valuePointer: operator.pointerTo("VALUE_POINTER"),
    keyPointer: operator.get("KEY_POINTER")
  };
}

export function hashMapSize(dataView: DataView, mapPointer: number) {
  return dataView.getUint32(
    mapPointer + MAP_MACHINE.map.LINKED_LIST_SIZE.bytesOffset
  );
}

export function hashMapGetPointersToFree(
  dataView: DataView,
  hashmapPointer: number
) {
  const mapOperator = MAP_MACHINE.createOperator(dataView, hashmapPointer);
  const pointers: number[] = [hashmapPointer, mapOperator.get("ARRAY_POINTER")];
  const pointersToValuePointers: number[] = [];

  const pointersOfLinkedList = linkedListGetPointersToFree(
    dataView,
    mapOperator.get("LINKED_LIST_POINTER")
  );

  pointers.push(...pointersOfLinkedList.pointers);
  const nodeOperator = NODE_MACHINE.createOperator(dataView, 0);

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
  carrier: DataViewAndAllocatorCarrier,
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
      carrier.dataView,
      mapOperator.startAddress,
      pointerToNode
    )) !== 0
  ) {
    hashMapRehashInsert(carrier, biggerArray, newCapacity, pointerToNode);
  }
}

function hashMapRehashInsert(
  { dataView }: DataViewAndAllocatorCarrier,
  bucketsArrayPointer: number,
  arraySize: number,
  nodePointer: number
) {
  const nodeOperator = NODE_MACHINE.createOperator(dataView, nodePointer);
  const keyInfo = getKeyStartLength(dataView, nodeOperator.get("KEY_POINTER"));

  const keyHashCode = hashCodeInPlace(
    dataView,
    arraySize,
    keyInfo.start,
    keyInfo.length
  );

  const bucket = keyHashCode % arraySize;
  const bucketStartPointer =
    bucketsArrayPointer + bucket * Uint32Array.BYTES_PER_ELEMENT;

  const prevFirstNodeInBucket = dataView.getUint32(bucketStartPointer);
  dataView.setUint32(bucketStartPointer, nodePointer);
  nodeOperator.set("NEXT_NODE_POINTER", prevFirstNodeInBucket);

  // // Add is first node in bucket
  // if (nodeOperator.startAddress === 0) {
  //   dataView.setUint32(bucketStartPointer, nodePointer);
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
  dataView: DataView,
  mapPointer: number
) {
  let iteratorToken = 0;

  while (
    (iteratorToken = hashMapLowLevelIterator(
      dataView,
      mapPointer,
      iteratorToken
    )) !== 0
  ) {
    yield iteratorToken;
  }
}
