import type { Heap } from "../structsGenerator/consts";
import type { IMemPool } from "@thi.ng/malloc";

export interface MemoryStats {
  available: number;
  used: number;
  total: number;
  top: number;
}

export interface GlobalCarrier {
  allocator: IMemPool;
  heap: Heap;
}

export type ExternalArgs = Readonly<{
  hashMapLoadFactor: number;
  hashMapMinInitialCapacity: number;
  /**
   * Allocate additional memory for array pointers,
   * will prevent the reallocation and copy when array is getting bigger
   */
  arrayAdditionalAllocation: number;
}>;

export type ExternalArgsApi = Readonly<{
  hashMapLoadFactor?: number;
  hashMapMinInitialCapacity?: number;
  arrayAdditionalAllocation?: number;
}>;

export interface InternalAPI {
  getExternalArgs(): ExternalArgs;
  getCarrier(): Readonly<GlobalCarrier>;
  replaceCarrierContent(carrier: GlobalCarrier): void;
  getEntryPointer(): number;
  destroy(): number;
}
