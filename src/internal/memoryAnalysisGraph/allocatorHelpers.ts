import { listAllAllocatedPointers } from "../../allocator/functional";
import { TransactionalAllocator } from "../TransactionalAllocator";

export class MemPoolWithTricks extends TransactionalAllocator {
  public listAllAllocatedPointers() {
    return listAllAllocatedPointers(this.allocatorState);
  }
}
