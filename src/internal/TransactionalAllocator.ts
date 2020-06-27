import { MemPool, MemPoolOpts } from "@thi.ng/malloc";
import { OutOfMemoryError } from "./exceptions";

export class TransactionalAllocator extends MemPool {
  protected inTransaction: boolean;
  protected transactionAddresses: number[];

  constructor(opts?: Partial<MemPoolOpts>) {
    super(opts);
    this.inTransaction = false;
    this.transactionAddresses = [];
  }

  public setNewEnd(newEnd: number) {
    this.end = newEnd;
  }

  public malloc(bytes: number): number {
    if (bytes === 0) {
      return 0;
    }

    const address = super.malloc(bytes);

    if (address === 0) {
      if (this.transactionAddresses.length > 0) {
        for (const block of this.transactionAddresses) {
          this.free(block);
        }
      }

      this.endTransaction();

      throw new OutOfMemoryError();
    }

    this.transactionAddresses.push(address);

    return address;
  }

  public transaction<T>(cmd: () => T) {
    this.startTransaction();
    try {
      return cmd();
    } finally {
      this.endTransaction();
    }
  }

  public startTransaction() {
    this.inTransaction = true;
  }

  public endTransaction() {
    this.inTransaction = false;
    this.transactionAddresses = [];
  }
}
