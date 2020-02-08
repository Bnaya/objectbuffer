import { createMemoryMachine } from "../memoryMachinery";
import { GlobalCarrier } from "../interfaces";

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

export const LINKED_LIST_ITEM_MACHINE = createMemoryMachine({
  NEXT_POINTER: Uint32Array,
  VALUE: Uint32Array
});

export type LinkedListItemMachineType = ReturnType<
  typeof LINKED_LIST_ITEM_MACHINE.createOperator
>;

export const LINKED_LIST_MACHINE = createMemoryMachine({
  END_POINTER: Uint32Array,
  START_POINTER: Uint32Array
});
export type LinkedListMachineType = ReturnType<
  typeof LINKED_LIST_MACHINE.createOperator
>;

export function initLinkedList(carrier: GlobalCarrier) {
  const { allocator } = carrier;
  const memoryForLinkedList = allocator.calloc(LINKED_LIST_MACHINE.map.SIZE_OF);
  const memoryForEndMarkerItem = allocator.calloc(
    LINKED_LIST_ITEM_MACHINE.map.SIZE_OF
  );

  const linkedListMachine = LINKED_LIST_MACHINE.createOperator(
    carrier,
    memoryForLinkedList
  );

  linkedListMachine.set("START_POINTER", memoryForEndMarkerItem);
  linkedListMachine.set("END_POINTER", memoryForEndMarkerItem);

  return memoryForLinkedList;
}

export function linkedListItemInsert(
  carrier: GlobalCarrier,
  linkedListPointer: number,
  nodeValuePointer: number
) {
  const newItemMemory: number = carrier.allocator.calloc(
    LINKED_LIST_ITEM_MACHINE.map.SIZE_OF
  );

  const linkedListOperator = LINKED_LIST_MACHINE.createOperator(
    carrier,
    linkedListPointer
  );

  const wasEndMarkerOperator = LINKED_LIST_ITEM_MACHINE.createOperator(
    carrier,
    linkedListOperator.get("END_POINTER")
  );

  const toBeEndMarkerOperator = LINKED_LIST_ITEM_MACHINE.createOperator(
    carrier,
    newItemMemory
  );

  toBeEndMarkerOperator.set("VALUE", 0);
  toBeEndMarkerOperator.set("NEXT_POINTER", 0);

  linkedListOperator.set("END_POINTER", toBeEndMarkerOperator.startAddress);

  wasEndMarkerOperator.set("VALUE", toBeEndMarkerOperator.startAddress);
  wasEndMarkerOperator.set("NEXT_POINTER", toBeEndMarkerOperator.startAddress);
  wasEndMarkerOperator.set("VALUE", nodeValuePointer);

  return wasEndMarkerOperator.startAddress;
}

export function linkedListItemRemove(
  carrier: GlobalCarrier,
  itemPointer: number
) {
  const itemToOverwrite = LINKED_LIST_ITEM_MACHINE.createOperator(
    carrier,
    itemPointer
  );

  const itemToOverwriteWith = LINKED_LIST_ITEM_MACHINE.createOperator(
    carrier,
    itemToOverwrite.get("NEXT_POINTER")
  );

  const memoryToFree = itemToOverwrite.get("NEXT_POINTER");

  itemToOverwrite.set("VALUE", itemToOverwriteWith.get("VALUE"));

  itemToOverwrite.set("NEXT_POINTER", itemToOverwriteWith.get("NEXT_POINTER"));

  carrier.allocator.free(memoryToFree);
}

export function linkedListLowLevelIterator(
  carrier: GlobalCarrier,
  linkedListPointer: number,
  itemPointer: number
) {
  const listItem = LINKED_LIST_ITEM_MACHINE.createOperator(
    carrier,
    itemPointer
  );

  if (itemPointer === 0) {
    const list = LINKED_LIST_MACHINE.createOperator(carrier, linkedListPointer);

    listItem.startAddress = list.get("START_POINTER");

    // can be zero if START_POINTER pointes to the end marker
    if (listItem.get("VALUE") === 0) {
      return 0;
    }

    // can be zero if START_POINTER pointes to the end marker
    return listItem.startAddress;
  }

  // deleted during iteration
  if (listItem.get("VALUE") === 0) {
    return 0;
  }

  listItem.startAddress = listItem.get("NEXT_POINTER");

  // next item is the end
  if (listItem.get("VALUE") === 0) {
    return 0;
  }

  return listItem.startAddress;
}

export function linkedListGetValue(
  carrier: GlobalCarrier,
  itemPointer: number
) {
  return LINKED_LIST_ITEM_MACHINE.createOperator(carrier, itemPointer).get(
    "VALUE"
  );
}

export function linkedListGetPointersToFree(
  carrier: GlobalCarrier,
  linkedListPointer: number
) {
  const pointers: number[] = [linkedListPointer];
  const valuePointers: number[] = [];

  const operator = LINKED_LIST_MACHINE.createOperator(
    carrier,
    linkedListPointer
  );

  const firstItem = operator.get("START_POINTER");
  const lastItem = operator.get("END_POINTER");

  // list empty
  if (firstItem === lastItem) {
    pointers.push(firstItem);
  }

  const linkItemOperator = LINKED_LIST_ITEM_MACHINE.createOperator(
    carrier,
    linkedListLowLevelIterator(carrier, linkedListPointer, 0)
  );

  while (linkItemOperator.startAddress !== 0) {
    pointers.push(linkItemOperator.startAddress);

    // value = 0 means end marker
    if (linkItemOperator.get("VALUE") !== 0) {
      valuePointers.push(linkItemOperator.get("VALUE"));
      // linkItemOperator.startAddress = 0;
    }

    linkItemOperator.startAddress = linkItemOperator.get("NEXT_POINTER");
  }

  return {
    pointers,
    valuePointers
  };
}
