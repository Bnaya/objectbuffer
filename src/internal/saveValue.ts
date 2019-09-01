import { primitiveValueToEntry, isPrimitive } from "./utils";
import { appendEntry } from "./store";
import { objectSaver } from "./objectSaver";

export function saveValue(textEncoder: any, dataView: DataView, value: any) {
  let totalWrittenBytes = 0;
  let valuePointer = 0;

  if (isPrimitive(value)) {
    const entry = primitiveValueToEntry(value);
    const { start, length } = appendEntry(dataView, entry, textEncoder);

    valuePointer = start;
    totalWrittenBytes += length;
  } else if (typeof value === "object") {
    const { start, length } = objectSaver(textEncoder, dataView, value);
    valuePointer = start;
    totalWrittenBytes += length;
  } else {
    throw new Error("unsupported yet");
  }

  return {
    start: valuePointer,
    length: totalWrittenBytes
  };
}
