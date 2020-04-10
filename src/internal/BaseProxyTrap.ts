import {
  ExternalArgs,
  GlobalCarrier,
  InternalAPI,
  DateEntry,
  ArrayEntry,
  ObjectEntry,
  MapEntry,
  SetEntry,
} from "./interfaces";
import { incrementRefCount, decrementRefCount, readEntry } from "./store";
import { WrapperDestroyed } from "./exceptions";

export class BaseProxyTrap<
  T extends ObjectEntry | DateEntry | ArrayEntry | MapEntry | SetEntry
> implements InternalAPI {
  constructor(
    protected externalArgs: ExternalArgs,
    protected carrier: GlobalCarrier,
    protected _entryPointer: number
  ) {
    incrementRefCount(this.externalArgs, this.carrier, this.entryPointer);
  }

  public destroy() {
    const newRefCount = decrementRefCount(
      this.externalArgs,
      this.carrier,
      this.entryPointer
    );
    this._entryPointer = 0;

    return newRefCount;
  }

  public getCarrier() {
    return this.carrier;
  }

  public replaceCarrierContent(newCarrierContent: GlobalCarrier) {
    Object.assign(this.carrier, newCarrierContent);
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
    return readEntry(this.carrier, this.entryPointer) as T;
  }
}
