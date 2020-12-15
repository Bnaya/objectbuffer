import { initializeArrayBuffer, incrementRefCount } from "./store";
import { createObjectWrapper } from "./objectWrapper";
import type {
  ObjectBufferSettings,
  GlobalCarrier,
  MemoryStats,
} from "./interfaces";
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
import { OutOfMemoryError, UnsupportedOperationError } from "./exceptions";
import { saveValueIterative } from "./saveValue";
import { TransactionalAllocator } from "./TransactionalAllocator";
import { freeNoLongerUsedAddresses } from "./freeNoLongerUsedAddresses";

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#Browser_compatibility
 *
 * Future holds additional types https://github.com/tc39/proposal-resizablearraybuffer
 */
export type ArrayBufferKind = "vanilla" | "shared";

/**
 * Create a new objectBuffer, with the given initial value
 * @param size The size of the ArrayBuffer to create (heap size)
 * @param initialValue
 * @param settings
 * @param arrayBufferConstructor
 */
export function createObjectBuffer<T = any>(
  size: number,
  initialValue: T,
  settings: ObjectBufferSettings = {},
  arrayBufferKind: ArrayBufferKind = "vanilla"
): T {
  if (!isSupportedTopLevelValue(initialValue)) {
    throw new UnsupportedOperationError();
  }

  const allocator = new TransactionalAllocator(
    {
      start: MEM_POOL_START,
      size,
    },
    arrayBufferKind === "shared"
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
      externalArgsApiToExternalArgsApi(settings),
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
    externalArgsApiToExternalArgsApi(settings),
    carrier,
    carrier.heap.u32[
      INITIAL_ENTRY_POINTER_TO_POINTER / Uint32Array.BYTES_PER_ELEMENT
    ]
  );
}

/**
 * Grow or shrink the underlying ArrayBuffer
 *
 * @unstable
 * Due to possible issues with future support of typed arrays,
 * and the upcoming proposal, this api function may be removed
 * https://github.com/tc39/proposal-resizablearraybuffer
 *
 * @param objectBuffer
 * @param newSize
 *
 */
export function unstable_resizeObjectBuffer(
  objectBuffer: unknown,
  newSize: number
) {
  if (newSize < memoryStats(objectBuffer).top) {
    throw new OutOfMemoryError();
  }

  const oldArrayBuffer = getUnderlyingArrayBuffer(objectBuffer);
  const newArrayBuffer = new ArrayBuffer(newSize);

  arrayBufferCopyTo(
    oldArrayBuffer,
    0,
    Math.min(newSize, oldArrayBuffer.byteLength),
    newArrayBuffer,
    0
  );

  unstable_replaceUnderlyingArrayBuffer(objectBuffer, newArrayBuffer);

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
 * @param settings
 * @param arrayBuffer
 */
export function loadObjectBuffer<T = any>(
  arrayBuffer: ArrayBuffer | SharedArrayBuffer,
  settings: ObjectBufferSettings = {}
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
    throw new Error("Endianness mismatch");
  }

  return createObjectWrapper(
    externalArgsApiToExternalArgsApi(settings),
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
 * @unstable
 * Due to possible issues with future support of typed arrays,
 * and the upcoming proposal, this api function may be removed
 * https://github.com/tc39/proposal-resizablearraybuffer
 *
 * @param objectBuffer
 * @param newArrayBuffer
 */
export function unstable_replaceUnderlyingArrayBuffer(
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
    throw new Error("Endianness mismatch");
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

export { reclaim, queueReclaim } from "./reclaim";

/**
 *  Update the settings of the given ObjectBuffer
 */
export function updateObjectBufferSettings(
  objectBuffer: unknown,
  options: ObjectBufferSettings
) {
  Object.assign(getInternalAPI(objectBuffer).getExternalArgs(), options);
}

export function readObjectBufferSettings(objectBuffer: unknown) {
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
export function processQueuedReclaims(objectBuffer: unknown) {
  freeNoLongerUsedAddresses(getInternalAPI(objectBuffer).getCarrier());
}
