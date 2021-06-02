@bnaya/objectbuffer

# @bnaya/objectbuffer

Basic usage (Browser):

```js
[[include:docs/codeExamples/basicUsage.js]]
```

## Table of contents

### Interfaces

- [ObjectBufferSettings](interfaces/objectbuffersettings.md)

### Functions

- [acquireLock](README.md#acquirelock)
- [acquireLockWait](README.md#acquirelockwait)
- [createObjectBuffer](README.md#createobjectbuffer)
- [getUnderlyingArrayBuffer](README.md#getunderlyingarraybuffer)
- [loadObjectBuffer](README.md#loadobjectbuffer)
- [memoryStats](README.md#memorystats)
- [processQueuedReclaims](README.md#processqueuedreclaims)
- [queueReclaim](README.md#queuereclaim)
- [reclaim](README.md#reclaim)
- [releaseLock](README.md#releaselock)
- [unstable\_replaceUnderlyingArrayBuffer](README.md#unstable_replaceunderlyingarraybuffer)
- [unstable\_resizeObjectBuffer](README.md#unstable_resizeobjectbuffer)
- [updateObjectBufferSettings](README.md#updateobjectbuffersettings)

## Functions

### acquireLock

▸ **acquireLock**(`agentId`, `objectBuffer`): `boolean`

Tries to acquire a lock on the given objectBuffer, as the given agentId.

#### Parameters

| Name | Type |
| :------ | :------ |
| `agentId` | `number` |
| `objectBuffer` | `any` |

#### Returns

`boolean`

#### Defined in

[internal/locks.ts:19](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/locks.ts#L19)

___

### acquireLockWait

▸ **acquireLockWait**(`agentId`, `objectBuffer`, `timeout`): ``"have-lock"`` \| ``"miss-lock"`` \| ``"timed-out"`` \| ``"no-lock"``

 Try to get a lock on a the given objectBuffer, or wait until timeout
 Will Not work on the main thread.
 Use only on workers
 Only when `"have-lock"` returned you actually got the lock

 Uses https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait under the hood

#### Parameters

| Name | Type |
| :------ | :------ |
| `agentId` | `number` |
| `objectBuffer` | `any` |
| `timeout` | `number` |

#### Returns

``"have-lock"`` \| ``"miss-lock"`` \| ``"timed-out"`` \| ``"no-lock"``

#### Defined in

[internal/locks.ts:76](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/locks.ts#L76)

___

### createObjectBuffer

▸ **createObjectBuffer**<T\>(`size`, `initialValue`, `settings?`, `arrayBufferKind?`): `T`

Create a new objectBuffer, with the given initial value

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` = `any` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `size` | `number` | `undefined` | The size of the ArrayBuffer to create (heap size) |
| `initialValue` | `T` | `undefined` |  |
| `settings` | [ObjectBufferSettings](interfaces/objectbuffersettings.md) | {} |  |
| `arrayBufferKind` | `ArrayBufferKind` | "vanilla" | - |

#### Returns

`T`

#### Defined in

[internal/api.ts:39](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L39)

___

### getUnderlyingArrayBuffer

▸ **getUnderlyingArrayBuffer**(`objectBuffer`): `ArrayBuffer` \| `SharedArrayBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBuffer` | `unknown` |

#### Returns

`ArrayBuffer` \| `SharedArrayBuffer`

#### Defined in

[internal/api.ts:131](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L131)

___

### loadObjectBuffer

▸ **loadObjectBuffer**<T\>(`arrayBuffer`, `settings?`): `T`

Create objectBuffer object from the given ArrayBuffer

The given ArrayBuffer is expected to be one obtained via getUnderlyingArrayBuffer
This operation doesn't change any value in the ArrayBuffer

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `arrayBuffer` | `ArrayBuffer` \| `SharedArrayBuffer` |
| `settings` | [ObjectBufferSettings](interfaces/objectbuffersettings.md) |

#### Returns

`T`

#### Defined in

[internal/api.ts:146](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L146)

___

### memoryStats

▸ **memoryStats**(`objectBuffer`): `MemoryStats`

Return the number of free & used bytes left in the given objectBuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBuffer` | `unknown` |

#### Returns

`MemoryStats`

#### Defined in

[internal/api.ts:215](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L215)

___

### processQueuedReclaims

▸ **processQueuedReclaims**(`objectBuffer`): `void`

Free all the addresses collected using FinalizationRegistry
When no FinalizationRegistry/WeakRef available, use disposeWrapperObject
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry

This is not called automatic by FinalizationRegistry,
because It's only safe to call it when you have a lock/similar (As any other operation)
And FinalizationRegistry might run when ever

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBuffer` | `unknown` |

#### Returns

`void`

#### Defined in

[internal/api.ts:248](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L248)

___

### queueReclaim

▸ **queueReclaim**(`objectBufferPart`): `void`

Similar to reclaim, Dispose the given objectBuffer part, make it not usable anymore,
but only queue the memory for later reclaiming

**`see`** processQueuedReclaims for actually processing the reclaim

The given part should not be top level ObjectBuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBufferPart` | `unknown` |

#### Returns

`void`

#### Defined in

[internal/reclaim.ts:58](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/reclaim.ts#L58)

___

### reclaim

▸ **reclaim**(`objectBufferPart`): `boolean`

Dispose the given objectBuffer part, make it not usable anymore,
immediately reclaiming memory if applicable (arc = 0 etc)
To be used on systems that does not support FinalizationRegistry or for immediate and not eventual memory reclaiming

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBufferPart` | `unknown` |

#### Returns

`boolean`

#### Defined in

[internal/reclaim.ts:14](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/reclaim.ts#L14)

___

### releaseLock

▸ **releaseLock**(`agentId`, `objectBuffer`): `boolean`

 Try to release a lock acquired by [acquireLock](README.md#acquirelock) or [acquireLockWait](README.md#acquirelockwait)

#### Parameters

| Name | Type |
| :------ | :------ |
| `agentId` | `number` |
| `objectBuffer` | `any` |

#### Returns

`boolean`

#### Defined in

[internal/locks.ts:42](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/locks.ts#L42)

___

### unstable\_replaceUnderlyingArrayBuffer

▸ **unstable_replaceUnderlyingArrayBuffer**(`objectBuffer`, `newArrayBuffer`): `void`

Replace the Underlying array buffer with the given one.
The given ArrayBuffer is expected to be a copy of the prev ArrayBuffer,
just bigger or smaller (less free space)

Consider using `resizeObjectBuffer`

**`unstable`**
Due to possible issues with future support of typed arrays,
and the upcoming proposal, this api function may be removed
https://github.com/tc39/proposal-resizablearraybuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBuffer` | `unknown` |
| `newArrayBuffer` | `ArrayBuffer` \| `SharedArrayBuffer` |

#### Returns

`void`

#### Defined in

[internal/api.ts:189](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L189)

___

### unstable\_resizeObjectBuffer

▸ **unstable_resizeObjectBuffer**(`objectBuffer`, `newSize`): `ArrayBuffer`

Grow or shrink the underlying ArrayBuffer

**`unstable`**
Due to possible issues with future support of typed arrays,
and the upcoming proposal, this api function may be removed
https://github.com/tc39/proposal-resizablearraybuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBuffer` | `unknown` |
| `newSize` | `number` |

#### Returns

`ArrayBuffer`

#### Defined in

[internal/api.ts:107](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L107)

___

### updateObjectBufferSettings

▸ **updateObjectBufferSettings**(`objectBuffer`, `options`): `void`

 Update the settings of the given ObjectBuffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectBuffer` | `unknown` |
| `options` | [ObjectBufferSettings](interfaces/objectbuffersettings.md) |

#### Returns

`void`

#### Defined in

[internal/api.ts:228](https://github.com/Bnaya/objectbuffer/blob/266152d/src/internal/api.ts#L228)
