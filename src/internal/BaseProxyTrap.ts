import { ExternalArgs, GlobalCarrier, InternalAPI } from "./interfaces";
import { incrementRefCount, decrementRefCount } from "./store";
import { WrapperDestroyed } from "./exceptions";

export abstract class BaseProxyTrap implements InternalAPI {
  constructor(
    protected externalArgs: ExternalArgs,
    protected carrier: GlobalCarrier,
    protected _entryPointer: number
  ) {
    incrementRefCount(this.carrier.heap, this.entryPointer);
  }

  public destroy() {
    const newRefCount = decrementRefCount(this.carrier.heap, this.entryPointer);
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
}
