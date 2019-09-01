// import { isPrimitive, primitiveValueToEntry } from "./utils";
import { appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import { ObjectPropEntry, ObjectEntry } from "./interfaces";
import { saveValue } from "./saveValue";

// DETECT circularities using set ??
export function objectSaver(
  textEncoder: any,
  dataView: DataView,
  objectToSave: any
) {
  let totalWrittenBytes = 0;
  // const writtenLength = 0;

  const objectEntries = Object.entries(objectToSave).reverse();

  let nextObjectEntryPointer = 0;

  for (const [key, value] of objectEntries) {
    const rOfValue = saveValue(textEncoder, dataView, value);

    const objectPropEntry: ObjectPropEntry = {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        value: rOfValue.start,
        key,
        next: nextObjectEntryPointer
      }
    };

    const rOfPropEntry = appendEntry(dataView, objectPropEntry, textEncoder);

    totalWrittenBytes += rOfPropEntry.length + rOfValue.length;
    nextObjectEntryPointer = rOfPropEntry.start;
  }

  const objectStartEntry: ObjectEntry = {
    type: ENTRY_TYPE.OBJECT,
    value: nextObjectEntryPointer
  };

  const objectEntryAppendResult = appendEntry(
    dataView,
    objectStartEntry,
    textEncoder
  );

  totalWrittenBytes += objectEntryAppendResult.length;

  return {
    start: objectEntryAppendResult.start,
    length: totalWrittenBytes
  };
}
