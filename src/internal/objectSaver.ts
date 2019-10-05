// import { isPrimitive, primitiveValueToEntry } from "./utils";
import { appendEntry } from "./store";
import { ENTRY_TYPE } from "./entry-types";
import { ObjectPropEntry, ObjectEntry, ExternalArgs } from "./interfaces";
import { saveValue } from "./saveValue";

export function objectSaver(
  externalArgs: ExternalArgs,
  dataView: DataView,
  objectToSave: any
) {
  let totalWrittenBytes = 0;
  // const writtenLength = 0;

  const objectEntries = Object.entries(objectToSave).reverse();

  let nextObjectEntryPointer = 0;

  for (const [key, value] of objectEntries) {
    const rOfValue = saveValue(externalArgs, dataView, value);

    const objectPropEntry: ObjectPropEntry = {
      type: ENTRY_TYPE.OBJECT_PROP,
      value: {
        value: rOfValue.start,
        key,
        next: nextObjectEntryPointer
      }
    };

    const rOfPropEntry = appendEntry(externalArgs, dataView, objectPropEntry);

    totalWrittenBytes += rOfPropEntry.length + rOfValue.length;
    nextObjectEntryPointer = rOfPropEntry.start;
  }

  const objectStartEntry: ObjectEntry = {
    type: ENTRY_TYPE.OBJECT,
    value: nextObjectEntryPointer
  };

  const objectEntryAppendResult = appendEntry(
    externalArgs,
    dataView,
    objectStartEntry
  );

  totalWrittenBytes += objectEntryAppendResult.length;

  return {
    start: objectEntryAppendResult.start,
    length: totalWrittenBytes
  };
}
