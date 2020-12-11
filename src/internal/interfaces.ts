import type { Heap } from "../structsGenerator/consts";
import type { TransactionalAllocator } from "./TransactionalAllocator";

export interface MemoryStats {
  available: number;
  used: number;
  total: number;
  top: number;
}

export interface GlobalCarrier {
  allocator: TransactionalAllocator;
  heap: Heap;
}

export interface ExternalArgs {
  /**
   * The load factor of the internal hash maps in use
   * @default 0.75
   */
  readonly hashMapLoadFactor: number;
  /**
   * Minimal initial buckets count of internal hash maps in use
   * @default 8
   */
  readonly hashMapMinInitialCapacity: number;
  /**
   * Allocate additional memory for array pointers,
   * will prevent the reallocation and copy when array is getting bigger
   * @default 0
   */
  readonly arrayAdditionalAllocation: number;
}

export interface ObjectBufferSettings {
  /**
   * The load factor of the internal hash maps in use
   * @default 0.75
   */
  readonly hashMapLoadFactor?: number;
  /**
   * Minimal initial buckets count of internal hash maps in use
   * @default 8
   */
  readonly hashMapMinInitialCapacity?: number;
  /**
   * Allocate additional memory for array pointers,
   * will prevent the reallocation and copy when array is getting bigger
   * @default 0
   */
  readonly arrayAdditionalAllocation?: number;
}

export interface InternalAPI {
  getExternalArgs(): ExternalArgs;
  getCarrier(): Readonly<GlobalCarrier>;
  replaceCarrierContent(carrier: GlobalCarrier): void;
  getEntryPointer(): number;
  destroy(): number;
}
