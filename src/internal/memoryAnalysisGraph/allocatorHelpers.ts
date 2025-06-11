import { listAllAllocatedPointers } from "../../allocator/functional";
import { TransactionalAllocator } from "../TransactionalAllocator";

export class MemPoolWithTricks extends TransactionalAllocator {
  public listAllAllocatedPointers(): {
    blockPointer: number;
    pointer: number;
    size: number;
  }[] {
    return listAllAllocatedPointers(this.allocatorState);
  }
}
