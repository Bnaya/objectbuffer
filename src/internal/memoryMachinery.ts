import { GlobalCarrier } from "./interfaces";

const ALLOWS_TYPED_ARRAYS_CTORS = [
  Uint8Array,
  Uint32Array,
  // BigUint64Array,
  Uint16Array
] as const;

type TypedArrayCtor = typeof ALLOWS_TYPED_ARRAYS_CTORS[number];

type LayoutDeclaration<T extends string> = T extends "SIZE_OF"
  ? never
  : Record<T, TypedArrayCtor>;

export type MemoryMap<T extends string> = {
  [x in T]: {
    bytesOffset: number;
    type: TypedArrayCtor;
  };
} & { SIZE_OF: number };

// DataView.prototype is any, ts thing. this is a workaround for better types.
// let dataViewInstance = new DataView(new ArrayBuffer(0));

// const READ_WRITE_MAPS = [
//   [Uint8Array, dataViewInstance.getUint8, dataViewInstance.setUint8],
//   [Uint32Array, dataViewInstance.getUint32, dataViewInstance.setUint32],
//   // [BigUint64Array, dataViewInstance.getBigUint64, dataViewInstance.setBigUint64],
//   [Uint16Array, dataViewInstance.getUint16, dataViewInstance.setUint16]
// ] as const;

const READ_WRITE_MAPS_V2 = [
  [Uint8Array, "uint8"],
  [Uint32Array, "uint32"],
  // [BigUint64Array, dataViewInstance.getBigUint64, dataViewInstance.setBigUint64],
  [Uint16Array, "uint16"]
] as const;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// dataViewInstance = undefined;

// const READ_MAP = new Map(READ_WRITE_MAPS.map(e => [e[0], e[1]]));
// const WRITE_MAP = new Map(READ_WRITE_MAPS.map(e => [e[0], e[2]]));

const READ_WRITE_MAP_V2 = new Map(READ_WRITE_MAPS_V2.map(e => [e[0], e[1]]));

export interface MemoryOperator<T extends string> {
  set(key: T, value: number): void;
  get(key: T): number;
  pointerTo(key: T): number;
  startAddress: number;
  readonly size: number;
}

export function createMemoryOperator<T extends string>(
  memoryMap: MemoryMap<T>,
  carrier: GlobalCarrier,
  startAddress: number
): MemoryOperator<T> {
  return {
    set(key: T, value: number) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const func = READ_WRITE_MAP_V2.get(memoryMap[key].type)!;

      return (carrier[func][
        (startAddress + memoryMap[key].bytesOffset) /
          memoryMap[key].type.BYTES_PER_ELEMENT
      ] = value);
    },
    get(key: T): number {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const func = READ_WRITE_MAP_V2.get(memoryMap[key].type)!;

      return carrier[func][
        (startAddress + memoryMap[key].bytesOffset) /
          memoryMap[key].type.BYTES_PER_ELEMENT
      ];
    },
    pointerTo(key: T): number {
      return startAddress + memoryMap[key].bytesOffset;
    },
    get startAddress() {
      return startAddress;
    },
    set startAddress(value: number) {
      startAddress = value;
    },
    size: memoryMap.SIZE_OF
  };
}

export function layoutDeclarationToMemoryMap<T extends string>(
  input: LayoutDeclaration<T>
): MemoryMap<T> {
  const oldEntries = Object.entries(input);
  const newObjectEntries: Array<[
    string,
    { type: TypedArrayCtor; bytesOffset: number }
  ]> = [];

  for (const [index, [key, type]] of oldEntries.entries()) {
    if (index === 0) {
      newObjectEntries.push([key, { bytesOffset: 0, type: type as any }]);
    } else {
      newObjectEntries.push([
        key,
        {
          bytesOffset:
            newObjectEntries[index - 1][1].bytesOffset +
            (oldEntries[index - 1][1] as any).BYTES_PER_ELEMENT,
          type: type as any
        }
      ]);
    }
  }

  (newObjectEntries as any).push([
    "SIZE_OF",
    newObjectEntries[newObjectEntries.length - 1][1].bytesOffset +
      (oldEntries[newObjectEntries.length - 1][1] as TypedArrayCtor)
        .BYTES_PER_ELEMENT
  ]);

  return Object.fromEntries(newObjectEntries) as any;
}

export function createMemoryMachine<T extends string>(
  layoutDeclaration: LayoutDeclaration<T>
) {
  const map = layoutDeclarationToMemoryMap(layoutDeclaration);

  return {
    map,
    createOperator: createMemoryOperator.bind(null, map) as (
      carrier: GlobalCarrier,
      address: number
    ) => MemoryOperator<T>
  };
}

export function _buildMemoryLayout<T extends { [x: string]: number }>(
  sizesDeclarations: T
): T & { TOTAL_SIZE: number } {
  const oldEntries = Object.entries(sizesDeclarations);
  const newObjectEntries: Array<[string, number]> = [];

  for (const [index, [key]] of oldEntries.entries()) {
    if (index === 0) {
      newObjectEntries.push([key, 0]);
    } else {
      newObjectEntries.push([
        key,
        newObjectEntries[index - 1][1] + oldEntries[index - 1][1]
      ]);
    }
  }

  newObjectEntries.push([
    "TOTAL_SIZE",
    newObjectEntries[newObjectEntries.length - 1][1] +
      oldEntries[newObjectEntries.length - 1][1]
  ]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return Object.fromEntries(newObjectEntries);
}
