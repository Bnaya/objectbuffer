import { createMemoryMachine } from "../memoryMachinery";

export const MAP_MACHINE = createMemoryMachine({
  CAPACITY: Uint8Array,
  USED_CAPACITY: Uint8Array,
  ARRAY_POINTER: Uint32Array,
  LINKED_LIST_POINTER: Uint32Array,
  // maybe put save this value in the linked list?
  LINKED_LIST_SIZE: Uint32Array
});

export const NODE_MACHINE = createMemoryMachine({
  VALUE_POINTER: Uint32Array,
  NEXT_NODE_POINTER: Uint32Array,
  KEY_POINTER: Uint32Array,
  LINKED_LIST_ITEM_POINTER: Uint32Array
});

export type MapMachineType = ReturnType<typeof MAP_MACHINE.createOperator>;
export type NodeMachineType = ReturnType<typeof NODE_MACHINE.createOperator>;
