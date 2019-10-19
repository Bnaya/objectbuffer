import { ExternalArgs, DataViewCarrier, DateEntry } from "./interfaces";

import { readEntry, writeEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import { INTERNAL_API_SYMBOL } from "./symbols";
import { UnsupportedOperationError } from "./exceptions";

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
  "toLocaleTimeString"
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
  "setUTCSeconds"
  // "setYear"
];

export class DateWrapper implements ProxyHandler<Date> {
  private dateObjectForReuse: Date;
  private useMeToGiveNamesToFunctionsAndCacheThem: any;

  constructor(
    private externalArgs: ExternalArgs,
    private dataViewCarrier: DataViewCarrier,
    private entryPointer: number
  ) {
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
    const entry = readEntry(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer
    ) as [DateEntry, number];

    this.dateObjectForReuse.setTime(entry[0].value);
  }

  private persistDateObject() {
    writeEntry(
      this.externalArgs,
      this.dataViewCarrier.dataView,
      this.entryPointer,
      {
        type: ENTRY_TYPE.DATE,
        value: this.dateObjectForReuse.getTime()
      }
    );
  }

  public getDataView() {
    return this.dataViewCarrier.dataView;
  }

  public getEntryPointer() {
    return this.entryPointer;
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
  dataViewCarrier: DataViewCarrier,
  entryPointer: number
): Date {
  return new Proxy(
    new Date(0),
    new DateWrapper(externalArgs, dataViewCarrier, entryPointer)
  );
}
