import type { ExternalArgs, GlobalCarrier, InternalAPI } from "./interfaces";
import { incrementRefCount } from "./store";
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
    this._entryPointer = 0;
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
