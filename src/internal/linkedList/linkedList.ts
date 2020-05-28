import type { GlobalCarrier } from "../interfaces";
import {
  linkedListItem_size,
  linkedList_size,
  linkedList_set_all,
  linkedListItem_set_all,
  linkedList_END_POINTER_get,
  linkedList_END_POINTER_set,
  linkedListItem_NEXT_POINTER_get,
  linkedListItem_VALUE_get,
  linkedList_START_POINTER_get,
} from "../generatedStructs";
import { Heap } from "../../structsGenerator/consts";

/*

// iterator needs to change during iteration, how?
a = new Map([["a", 1], ["b", 2], ["c", 3]])

for (const bla of a) {
	console.log(bla)
	a.delete("b")
}

// ["a", 1]
// ["c", 3]

*/

// export const LINKED_LIST_ITEM_MACHINE = createMemoryMachine({
//   NEXT_POINTER: Uint32Array,
//   VALUE: Uint32Array,
// });

// export type LinkedListItemMachineType = ReturnType<
//   typeof LINKED_LIST_ITEM_MACHINE.createOperator
// >;

// export const LINKED_LIST_MACHINE = createMemoryMachine({
//   END_POINTER: Uint32Array,
//   START_POINTER: Uint32Array,
// });
// export type LinkedListMachineType = ReturnType<
//   typeof LINKED_LIST_MACHINE.createOperator
// >;

export function initLinkedList(carrier: GlobalCarrier) {
  const { allocator, heap } = carrier;
  const memoryForLinkedList = allocator.calloc(linkedList_size);
  const memoryForEndMarkerItem = allocator.calloc(linkedListItem_size);

  linkedList_set_all(
    heap,
    memoryForLinkedList,
    memoryForEndMarkerItem,
    memoryForEndMarkerItem
  );

  return memoryForLinkedList;
}

export function linkedListItemInsert(
  carrier: GlobalCarrier,
  linkedListPointer: number,
  nodeValuePointer: number
) {
  const { allocator, heap } = carrier;
  const newEndMarker = allocator.calloc(linkedListItem_size);

  linkedListItem_set_all(heap, newEndMarker, 0, 0);
  const wasEndMarker = linkedList_END_POINTER_get(heap, linkedListPointer);
  linkedList_END_POINTER_set(heap, linkedListPointer, newEndMarker);

  linkedListItem_set_all(heap, wasEndMarker, newEndMarker, nodeValuePointer);

  return wasEndMarker;
}

export function linkedListItemRemove(
  { heap, allocator }: GlobalCarrier,
  itemPointer: number
) {
  const memoryToFree = linkedListItem_NEXT_POINTER_get(heap, itemPointer);
  linkedListItem_set_all(
    heap,
    itemPointer,
    linkedListItem_NEXT_POINTER_get(heap, memoryToFree),
    linkedListItem_VALUE_get(heap, memoryToFree)
  );

  allocator.free(memoryToFree);
}

export function linkedListLowLevelIterator(
  heap: Heap,
  linkedListPointer: number,
  itemPointer: number
) {
  let iteratedItem = itemPointer;

  // new iteration session
  if (itemPointer === 0) {
    // read the first item in the list
    iteratedItem = linkedList_START_POINTER_get(heap, linkedListPointer);

    // can be zero if START_POINTER pointes to the end marker
    if (linkedListItem_VALUE_get(heap, iteratedItem) === 0) {
      return 0;
    }

    // can be zero if START_POINTER pointes to the end marker
    return iteratedItem;
  }

  // deleted during iteration
  if (linkedListItem_VALUE_get(heap, iteratedItem) === 0) {
    return 0;
  }

  iteratedItem = linkedListItem_NEXT_POINTER_get(heap, iteratedItem);

  // next item is the end
  if (linkedListItem_VALUE_get(heap, iteratedItem) === 0) {
    return 0;
  }

  return iteratedItem;
}

export function linkedListGetValue(heap: Heap, itemPointer: number) {
  return linkedListItem_VALUE_get(heap, itemPointer);
}

export function linkedListGetPointersToFree(
  heap: Heap,
  linkedListPointer: number
) {
  const pointers: number[] = [linkedListPointer];
  const valuePointers: number[] = [];

  const firstItem = linkedList_START_POINTER_get(heap, linkedListPointer);
  const lastItem = linkedList_END_POINTER_get(heap, linkedListPointer);

  // list empty
  if (firstItem === lastItem) {
    pointers.push(firstItem);
  }

  let iterator = linkedListLowLevelIterator(heap, linkedListPointer, 0);

  while (iterator) {
    pointers.push(iterator);

    // value = 0 means end marker
    if (linkedListItem_VALUE_get(heap, iterator) !== 0) {
      valuePointers.push(linkedListItem_VALUE_get(heap, iterator));
      // linkItemOperator.startAddress = 0;
    }

    iterator = linkedListItem_NEXT_POINTER_get(heap, iterator);
  }

  return {
    pointers,
    valuePointers,
  };
}
