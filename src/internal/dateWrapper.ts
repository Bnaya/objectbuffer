import { ExternalArgs, GlobalCarrier } from "./interfaces";

import { ENTRY_TYPE } from "./entry-types";
import { INTERNAL_API_SYMBOL } from "./symbols";
import { UnsupportedOperationError } from "./exceptions";
import { BaseProxyTrap } from "./BaseProxyTrap";
import {
  date_set_all,
  date_refsCount_get,
  date_timestamp_get,
} from "./generatedStructs";

const getFunctions: Array<keyof Date> = [
  "toString",
  "toDateString",
  "toTimeString",
  "toISOString",
  "toUTCString",
  // "toGMTString",
  "getDate",
  "getDay",
  "getFullYear",
  "getHours",
  "getMilliseconds",
  "getMinutes",
  "getMonth",
  "getSeconds",
  "getTime",
  "getTimezoneOffset",
  "getUTCDate",
  "getUTCDay",
  "getUTCFullYear",
  "getUTCHours",
  "getUTCMilliseconds",
  "getUTCMinutes",
  "getUTCMonth",
  "getUTCSeconds",
  // "getYear",
  "toJSON",
  "toLocaleString",
  "toLocaleDateString",
  "toLocaleTimeString",
];

const setFunctions: Array<keyof Date> = [
  "setDate",
  "setFullYear",
  "setHours",
  "setMilliseconds",
  "setMinutes",
  "setMonth",
  "setSeconds",
  "setTime",
  "getTimezoneOffset",
  "setUTCDate",
  "setUTCFullYear",
  "setUTCHours",
  "setUTCMilliseconds",
  "setUTCMinutes",
  "setUTCMonth",
  "setUTCSeconds",
  // "setYear"
];

export class DateWrapper extends BaseProxyTrap implements ProxyHandler<Date> {
  private dateObjectForReuse: Date;
  private useMeToGiveNamesToFunctionsAndCacheThem: any;

  constructor(
    externalArgs: ExternalArgs,
    carrier: GlobalCarrier,
    entryPointer: number
  ) {
    super(externalArgs, carrier, entryPointer);
    this.dateObjectForReuse = new Date();
    this.useMeToGiveNamesToFunctionsAndCacheThem = {};
  }

  get(target: Date, p: PropertyKey) {
    if (p === INTERNAL_API_SYMBOL) {
      return this;
    }

    if (getFunctions.includes(p as any)) {
      if (!(p in this.useMeToGiveNamesToFunctionsAndCacheThem)) {
        this.useMeToGiveNamesToFunctionsAndCacheThem[p] = () => {
          this.updateDateObjectForReuse();
          return (this.dateObjectForReuse as any)[p]();
        };
      }

      return this.useMeToGiveNamesToFunctionsAndCacheThem[p];
    } else if (setFunctions.includes(p as any)) {
      if (!(p in this.useMeToGiveNamesToFunctionsAndCacheThem)) {
        this.useMeToGiveNamesToFunctionsAndCacheThem[p] = (...args: any) => {
          this.updateDateObjectForReuse();
          const returnValue = (this.dateObjectForReuse as any)[p](...args);
          this.persistDateObject();
          return returnValue;
        };
      }

      return this.useMeToGiveNamesToFunctionsAndCacheThem[p];
    } else {
      return (target as any)[p];
    }
  }

  private updateDateObjectForReuse() {
    this.dateObjectForReuse.setTime(
      date_timestamp_get(this.carrier.heap, this.entryPointer)
    );
  }

  private persistDateObject() {
    date_set_all(
      this.carrier.heap,
      this.entryPointer,
      ENTRY_TYPE.DATE,
      date_refsCount_get(this.carrier.heap, this.entryPointer),
      // padding
      0,
      this.dateObjectForReuse.getTime()
    );
  }

  public defineProperty(): boolean {
    throw new UnsupportedOperationError();
  }

  public setPrototypeOf(): boolean {
    throw new UnsupportedOperationError();
  }

  public isExtensible() {
    return false;
  }
}

export function createDateWrapper(
  externalArgs: ExternalArgs,
  carrier: GlobalCarrier,
  entryPointer: number
): Date {
  return new Proxy(
    new Date(0),
    new DateWrapper(externalArgs, carrier, entryPointer)
  );
}
