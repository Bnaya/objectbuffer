import type { ExternalArgs, GlobalCarrier, InternalAPI } from "./interfaces";
import { incrementRefCount } from "./store";
import { WrapperDestroyed } from "./exceptions";
import { INTERNAL_API_SYMBOL } from "./symbols";

// See https://github.com/microsoft/TypeScript/issues/61892#issuecomment-2989433469
// oxlint-disable-next-line no-unsafe-declaration-merging
export interface BaseProxyTrap {
  [INTERNAL_API_SYMBOL](): InternalAPI;
}

export abstract class BaseProxyTrap implements InternalAPI {
  constructor(
    protected externalArgs: ExternalArgs,
    protected carrier: GlobalCarrier,
    protected _entryPointer: number
  ) {
    incrementRefCount(this.carrier.heap, this.entryPointer);
    // See https://github.com/microsoft/TypeScript/issues/61892#issuecomment-2989433469
    this[INTERNAL_API_SYMBOL] = () => {
      return this;
    };
  }

  public destroy(): void {
    this._entryPointer = 0;
  }

  public getCarrier(): GlobalCarrier {
    return this.carrier;
  }

  public replaceCarrierContent(newCarrierContent: GlobalCarrier): void {
    Object.assign(this.carrier, newCarrierContent);
  }

  public getEntryPointer(): number {
    return this.entryPointer;
  }

  public getExternalArgs(): ExternalArgs {
    return this.externalArgs;
  }

  protected get entryPointer(): number {
    if (this._entryPointer === 0) {
      throw new WrapperDestroyed();
    }

    return this._entryPointer;
  }
}
