/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExternalArgs } from "./interfaces";
import { saveValue } from "./saveValue";

/**
 * Calculate the size (bytes) of the given value.
 * Also validates that the value is saveable
 *
 * @param externalArgs
 * @param value
 */
export function sizeOf(externalArgs: ExternalArgs, value: any) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const fakeDataView = new FakeDataView();

  saveValue(externalArgs, fakeDataView, value);

  return fakeDataView.sizeOf;
}

const freeMemoryLocation = 8;

class FakeDataView implements DataView {
  private firstFreeByte: number;

  buffer!: ArrayBuffer;
  byteLength!: number;
  byteOffset!: number;

  constructor() {
    this.firstFreeByte = freeMemoryLocation;
  }

  public get sizeOf() {
    return this.firstFreeByte - freeMemoryLocation;
  }

  getFloat32(byteOffset: number, littleEndian?: boolean | undefined): number {
    throw new Error("Method not implemented.");
  }
  getFloat64(byteOffset: number, littleEndian?: boolean | undefined): number {
    throw new Error("Method not implemented.");
  }
  getInt8(byteOffset: number): number {
    throw new Error("Method not implemented.");
  }
  getInt16(byteOffset: number, littleEndian?: boolean | undefined): number {
    throw new Error("Method not implemented.");
  }
  getInt32(byteOffset: number, littleEndian?: boolean | undefined): number {
    throw new Error("Method not implemented.");
  }
  getUint8(byteOffset: number): number {
    throw new Error("Method not implemented.");
  }
  getUint16(byteOffset: number, littleEndian?: boolean | undefined): number {
    throw new Error("Method not implemented.");
  }
  getUint32(byteOffset: number, littleEndian?: boolean | undefined): number {
    if (byteOffset === freeMemoryLocation) {
      return this.firstFreeByte;
    }

    throw new Error("Method not implemented.");
  }
  setFloat32(
    byteOffset: number,
    value: number,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
  setFloat64(
    byteOffset: number,
    value: number,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
  setInt8(byteOffset: number, value: number): void {
    return;
  }
  setInt16(
    byteOffset: number,
    value: number,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
  setInt32(
    byteOffset: number,
    value: number,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
  setUint8(byteOffset: number, value: number): void {
    return;
  }
  setUint16(
    byteOffset: number,
    value: number,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
  setUint32(
    byteOffset: number,
    value: number,
    littleEndian?: boolean | undefined
  ): void {
    if (byteOffset == freeMemoryLocation) {
      this.firstFreeByte = value;
    }
  }
  [Symbol.toStringTag]: string;
  getBigInt64(byteOffset: number, littleEndian?: boolean | undefined): bigint {
    throw new Error("Method not implemented.");
  }
  getBigUint64(byteOffset: number, littleEndian?: boolean | undefined): bigint {
    throw new Error("Method not implemented.");
  }
  setBigInt64(
    byteOffset: number,
    value: bigint,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
  setBigUint64(
    byteOffset: number,
    value: bigint,
    littleEndian?: boolean | undefined
  ): void {
    return;
  }
}
