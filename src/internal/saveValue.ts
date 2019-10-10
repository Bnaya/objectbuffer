import { primitiveValueToEntry, isPrimitive } from "./utils";
import { appendEntry } from "./store";
import { objectSaver } from "./objectSaver";
import { arraySaver } from "./arraySaver";
import { GET_UNDERLYING_POINTER_SYMBOL } from "./symbols";
import { ExternalArgs } from "./interfaces";
import { ENTRY_TYPE } from "./entry-types";

export function saveValue(
  externalArgs: ExternalArgs,
  dataView: DataView,
  value: any
) {
  let totalWrittenBytes = 0;
  let valuePointer = 0;

  if (isPrimitive(value)) {
    const entry = primitiveValueToEntry(
      externalArgs,
      value,
      externalArgs.minimumStringAllocation
    );
    const { start, length } = appendEntry(externalArgs, dataView, entry);

    valuePointer = start;
    totalWrittenBytes += length;
  } else if (Array.isArray(value)) {
    const maybeOurPointer = value[GET_UNDERLYING_POINTER_SYMBOL as any];
    if (maybeOurPointer) {
      valuePointer = maybeOurPointer;
      totalWrittenBytes += 0;
    } else {
      const { start, length } = arraySaver(externalArgs, dataView, value);

      valuePointer = start;
      totalWrittenBytes += length;
    }
  } else if (value instanceof Date) {
    const maybeOurPointer = (value as any)[GET_UNDERLYING_POINTER_SYMBOL];

    if (maybeOurPointer) {
      valuePointer = maybeOurPointer;
      totalWrittenBytes += 0;
    } else {
      const { start, length } = appendEntry(externalArgs, dataView, {
        type: ENTRY_TYPE.DATE,
        value: value.getTime()
      });

      valuePointer = start;
      totalWrittenBytes += length;
    }
  } else if (typeof value === "object") {
    const maybeOurPointer = value[GET_UNDERLYING_POINTER_SYMBOL as any];

    if (maybeOurPointer) {
      valuePointer = maybeOurPointer;
      totalWrittenBytes += 0;
    } else {
      const { start, length } = objectSaver(externalArgs, dataView, value);
      valuePointer = start;
      totalWrittenBytes += length;
    }
  } else {
    throw new Error("unsupported yet");
  }

  return {
    start: valuePointer,
    length: totalWrittenBytes
  };
}
