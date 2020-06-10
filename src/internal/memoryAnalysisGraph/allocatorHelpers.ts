import { MemPool } from "@thi.ng/malloc";

const SIZEOF_MEM_BLOCK = 2 * 4;

export class MemPoolWithTricks extends MemPool {
  public listAllAllocatedPointers() {
    const pointers: Array<{
      blockPointer: number;
      pointer: number;
      size: number;
    }> = [];

    let block = this._used;

    while (block !== 0) {
      pointers.push({
        blockPointer: block,
        pointer: block + SIZEOF_MEM_BLOCK,
        size: this.blockSize(block),
      });

      block = this.blockNext(block);
    }

    return pointers;
  }
}
