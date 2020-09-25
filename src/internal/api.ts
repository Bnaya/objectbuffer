import { initializeArrayBuffer, incrementRefCount } from "./store";
import { createObjectWrapper } from "./objectWrapper";
import type { ExternalArgsApi, GlobalCarrier, MemoryStats } from "./interfaces";
import {
  arrayBufferCopyTo,
  externalArgsApiToExternalArgsApi,
  getInternalAPI,
  isSupportedTopLevelValue,
  getEndiannessOfSystem,
} from "./utils";
import {
  INITIAL_ENTRY_POINTER_TO_POINTER,
  MEM_POOL_START,
  ENDIANNESS_FLAG_POINTER,
} from "./consts";
import { UnsupportedOperationError } from "./exceptions";
import { saveValueIterative } from "./saveValue";
import { TransactionalAllocator } from "./TransactionalAllocator";
import { freeNoLongerUsedAddresses } from "./freeNoLongerUsedAddresses";

export interface CreateObjectBufferOptions {
  /**
   *  Use SharedArrayBuffer and not regular ArrayBuffer
   *
   *  See browser support:
   *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility
   */
  useSharedArrayBuffer?: boolean;
}

/**
 * Create a new objectBuffer, with the given initial value
 *
 * the initial value has to be an object.
 */
export function createObjectBuffer<T = any>(
  externalArgs: ExternalArgsApi,
  size: number,
  initialValue: T,
  options: CreateObjectBufferOptions = {}
): T {
  if (!isSupportedTopLevelValue(initialValue)) {
    throw new UnsupportedOperationError();
  }

  const allocator = new TransactionalAllocator(
    {
      start: MEM_POOL_START,
      size,
    },
    !!options.useSharedArrayBuffer
  );

  const arrayBuffer = allocator.getArrayBuffer();

  initializeArrayBuffer(arrayBuffer);

  const carrier: GlobalCarrier = {
    allocator,
    heap: allocator.getHeap(),
  };

  const referencedPointers: number[] = [];

  allocator.transaction(() => {
    saveValueIterative(
      externalArgsApiToExternalArgsApi(externalArgs),
      carrier,
      referencedPointers,
      INITIAL_ENTRY_POINTER_TO_POINTER,
      initialValue
    );
  });

  for (const pointer of referencedPointers) {
    incrementRefCount(carrier.heap, pointer);
  }

  const dv = new DataView(arrayBuffer);
  // endianness flag is always saved in little endian so we can read in every system endianness
  dv.setUint32(ENDIANNESS_FLAG_POINTER, getEndiannessOfSystem(), true);

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    carrier.heap.u32[
      INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
    ]
  );
}

/**
 * Grow or shrink the underlying ArrayBuffer
 *
 * @param objectBuffer
 * @param newSize
 */
export function resizeObjectBuffer(objectBuffer: unknown, newSize: number) {
  const oldArrayBuffer = getUnderlyingArrayBuffer(objectBuffer);
  const newArrayBuffer = new ArrayBuffer(newSize);

  arrayBufferCopyTo(
    oldArrayBuffer,
    0,
    Math.min(newSize, oldArrayBuffer.byteLength),
    newArrayBuffer,
    0
  );

  replaceUnderlyingArrayBuffer(objectBuffer, newArrayBuffer);

  return newArrayBuffer;
}

export function getUnderlyingArrayBuffer(
  objectBuffer: unknown
): ArrayBuffer | SharedArrayBuffer {
  return getInternalAPI(objectBuffer).getCarrier().heap.u8.buffer;
}

/**
 * Create objectBuffer object from the given ArrayBuffer
 *
 * The given ArrayBuffer is expected to be one obtained via getUnderlyingArrayBuffer
 * This operation doesn't change any value in the ArrayBuffer
 *
 * @param externalArgs
 * @param arrayBuffer
 */
export function loadObjectBuffer<T = any>(
  externalArgs: ExternalArgsApi,
  arrayBuffer: ArrayBuffer | SharedArrayBuffer
): T {
  const allocator = TransactionalAllocator.load(arrayBuffer);

  const carrier: GlobalCarrier = {
    allocator,
    heap: allocator.getHeap(),
  };

  const dv = new DataView(arrayBuffer);
  // endianness flag is always saved in little endian so we can read in every system endianness
  const endiannessOfGivenAb = dv.getUint32(ENDIANNESS_FLAG_POINTER, true);

  if (endiannessOfGivenAb !== getEndiannessOfSystem()) {
    throw new Error("Endianness miss-match");
  }

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(externalArgs),
    carrier,
    carrier.heap.u32[
      INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
    ]
  );
}

/**
 * Replace the Underlying array buffer with the given one.
 * The given ArrayBuffer is expected to be a copy of the prev ArrayBuffer,
 * just bigger or smaller (less free space)
 *
 * Consider using `resizeObjectBuffer`
 *
 * @param objectBuffer
 * @param newArrayBuffer
 */
export function replaceUnderlyingArrayBuffer(
  objectBuffer: unknown,
  newArrayBuffer: ArrayBuffer | SharedArrayBuffer
) {
  const allocator = TransactionalAllocator.load(newArrayBuffer);
  const carrier: GlobalCarrier = {
    allocator,
    heap: allocator.getHeap(),
  };

  const dv = new DataView(newArrayBuffer);
  // endianness flag is always saved in little endian so we can read in every system endianness
  const endiannessOfGivenAb = dv.getUint32(ENDIANNESS_FLAG_POINTER, true);

  if (endiannessOfGivenAb !== getEndiannessOfSystem()) {
    throw new Error("Endianness miss-match");
  }

  allocator.setNewEnd(newArrayBuffer.byteLength);

  getInternalAPI(objectBuffer).replaceCarrierContent(carrier);
}

/**
 * Return the number of free & used bytes left in the given objectBuffer
 */
export function memoryStats(objectBuffer: unknown): MemoryStats {
  const { available, total, top } = getInternalAPI(objectBuffer)
    .getCarrier()
    .allocator.stats();

  return { available, used: total - available, total, top };
}

export { disposeWrapperObject } from "./disposeWrapperObject";

/**
 * Allows to update external args passed to createObjectBuffer
 */
export function updateExternalArgs(
  objectBuffer: unknown,
  options: Partial<ExternalArgsApi>
) {
  Object.assign(getInternalAPI(objectBuffer).getExternalArgs(), options);
}

export function readExternalArgs(objectBuffer: unknown) {
  return getInternalAPI(objectBuffer).getExternalArgs();
}

/**
 * Free all the addresses collected using FinalizationRegistry
 * When no FinalizationRegistry/WeakRef available, use disposeWrapperObject
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
 *
 * This is not called automatic by FinalizationRegistry,
 * because It's only safe to call it when you have a lock/similar (As any other operation)
 * And FinalizationRegistry might run when ever
 */
export function collectGarbage(objectBuffer: unknown) {
  freeNoLongerUsedAddresses(getInternalAPI(objectBuffer).getCarrier());
}
