import {
  ExternalArgs,
  DataViewAndAllocatorCarrier,
  InternalAPI,
  DateEntry,
  ArrayEntry,
  ObjectEntry
} from "./interfaces";
import { IMemPool } from "@bnaya/malloc-temporary-fork";
import { incrementRefCount, decrementRefCount, readEntry } from "./store";
import { WrapperDestroyed } from "./exceptions";

export class BaseProxyTrap<T extends ObjectEntry | DateEntry | ArrayEntry>
  implements InternalAPI {
  constructor(
    protected externalArgs: ExternalArgs,
    protected carrier: DataViewAndAllocatorCarrier,
    protected _entryPointer: number
  ) {
    incrementRefCount(
      this.externalArgs,
      this.carrier.dataView,
      this.entryPointer
    );
  }

  public destroy() {
    const newRefCount = decrementRefCount(
      this.externalArgs,
      this.carrier.dataView,
      this.entryPointer
    );
    this._entryPointer = 0;

    return newRefCount;
  }

  public getCarrier() {
    return this.carrier;
  }

  public replaceCarrierContent(dataView: DataView, allocator: IMemPool) {
    this.carrier.dataView = dataView;
    this.carrier.allocator = allocator;
  }

  public getEntryPointer() {
    return this.entryPointer;
  }

  public getExternalArgs() {
    return this.externalArgs;
  }

  protected get entryPointer() {
    if (this._entryPointer === 0) {
      throw new WrapperDestroyed();
    }

    return this._entryPointer;
  }

  protected get entry(): T {
    return readEntry(
      this.externalArgs,
      this.carrier.dataView,
      this.entryPointer
    ) as T;
  }
}
