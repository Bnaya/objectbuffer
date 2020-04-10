[@bnaya/objectbuffer](README.md)

# @bnaya/objectbuffer

## Index

### Type aliases

* [CreateObjectBufferOptions](README.md#createobjectbufferoptions)
* [ExternalArgs](README.md#externalargs)

### Functions

* [acquireLock](README.md#acquirelock)
* [acquireLockWait](README.md#acquirelockwait)
* [createObjectBuffer](README.md#createobjectbuffer)
* [disposeWrapperObject](README.md#disposewrapperobject)
* [getUnderlyingArrayBuffer](README.md#getunderlyingarraybuffer)
* [loadObjectBuffer](README.md#loadobjectbuffer)
* [memoryStats](README.md#memorystats)
* [releaseLock](README.md#releaselock)
* [replaceUnderlyingArrayBuffer](README.md#replaceunderlyingarraybuffer)
* [resizeObjectBuffer](README.md#resizeobjectbuffer)
* [sizeOf](README.md#sizeof)
* [updateExternalArgs](README.md#updateexternalargs)

## Type aliases

###  CreateObjectBufferOptions

Ƭ **CreateObjectBufferOptions**: *CreateObjectBufferOptions*

*Defined in [index.ts:24](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/index.ts#L24)*

___

###  ExternalArgs

Ƭ **ExternalArgs**: *object*

*Defined in [index.ts:23](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/index.ts#L23)*

#### Type declaration:

## Functions

###  acquireLock

▸ **acquireLock**(`agentId`: number, `objectBuffer`: any): *boolean*

*Defined in [internal/locks.ts:15](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/locks.ts#L15)*

Try to acquire a lock on the given objectBuffer, as the given agentId.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`agentId` | number | - |
`objectBuffer` | any |   |

**Returns:** *boolean*

___

###  acquireLockWait

▸ **acquireLockWait**(`agentId`: number, `objectBuffer`: any, `timeout`: number): *"have-lock" | "miss-lock" | "timed-out" | "no-lock"*

*Defined in [internal/locks.ts:62](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/locks.ts#L62)*

 Try to get a lock on a the given objectBuffer, or wait until timeout
 Will Not work on the main thread.
 Use only on workers
 Only when `"have-lock"` returned you actually got the lock

 Uses https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait under the hood

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`agentId` | number | - |
`objectBuffer` | any | - |
`timeout` | number |   |

**Returns:** *"have-lock" | "miss-lock" | "timed-out" | "no-lock"*

___

###  createObjectBuffer

▸ **createObjectBuffer**<**T**>(`externalArgs`: ExternalArgsApi, `size`: number, `initialValue`: T, `options`: CreateObjectBufferOptions): *T*

*Defined in [internal/api.ts:31](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L31)*

Create a new objectBuffer, with the given initial value

the initial value has to be an object.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`externalArgs` | ExternalArgsApi | - |
`size` | number | - |
`initialValue` | T | - |
`options` | CreateObjectBufferOptions | {} |

**Returns:** *T*

___

###  disposeWrapperObject

▸ **disposeWrapperObject**(`value`: any): *boolean*

*Defined in [internal/disposeWrapperObject.ts:10](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/disposeWrapperObject.ts#L10)*

 Dispose the given objectWrapper, and re-claim the memory
 This is not needed on systems that supports weak-refs

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

###  getUnderlyingArrayBuffer

▸ **getUnderlyingArrayBuffer**(`objectBuffer`: any): *ArrayBuffer | SharedArrayBuffer*

*Defined in [internal/api.ts:109](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L109)*

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | any |

**Returns:** *ArrayBuffer | SharedArrayBuffer*

___

###  loadObjectBuffer

▸ **loadObjectBuffer**<**T**>(`externalArgs`: ExternalArgsApi, `arrayBuffer`: ArrayBuffer | SharedArrayBuffer): *T*

*Defined in [internal/api.ts:124](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L124)*

Create objectBuffer object from the given ArrayBuffer

The given ArrayBuffer is expected to be one obtained via getUnderlyingArrayBuffer
This operation doesn't change any value in the ArrayBuffer

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`externalArgs` | ExternalArgsApi | - |
`arrayBuffer` | ArrayBuffer &#124; SharedArrayBuffer |   |

**Returns:** *T*

___

###  memoryStats

▸ **memoryStats**(`objectBuffer`: any): *object*

*Defined in [internal/api.ts:208](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L208)*

Return the number of free & used bytes left in the given objectBuffer

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | any |

**Returns:** *object*

* **available**: *number*

* **used**: *number* = total - available

___

###  releaseLock

▸ **releaseLock**(`agentId`: number, `objectBuffer`: any): *boolean*

*Defined in [internal/locks.ts:33](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/locks.ts#L33)*

 Try to release a lock acquired by [acquireLock](README.md#acquirelock) or [acquireLockWait](README.md#acquirelockwait)

**Parameters:**

Name | Type |
------ | ------ |
`agentId` | number |
`objectBuffer` | any |

**Returns:** *boolean*

___

###  replaceUnderlyingArrayBuffer

▸ **replaceUnderlyingArrayBuffer**(`objectBuffer`: any, `newArrayBuffer`: ArrayBuffer | SharedArrayBuffer): *void*

*Defined in [internal/api.ts:165](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L165)*

Replace the Underlying array buffer with the given one.
The given ArrayBuffer is expected to be a copy of the prev ArrayBuffer,
just bigger or smaller (less free space)

Consider using `resizeObjectBuffer`

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`objectBuffer` | any | - |
`newArrayBuffer` | ArrayBuffer &#124; SharedArrayBuffer |   |

**Returns:** *void*

___

###  resizeObjectBuffer

▸ **resizeObjectBuffer**(`objectBuffer`: any, `newSize`: number): *ArrayBuffer*

*Defined in [internal/api.ts:92](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L92)*

Grow or shrink the underlying ArrayBuffer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`objectBuffer` | any | - |
`newSize` | number |   |

**Returns:** *ArrayBuffer*

___

###  sizeOf

▸ **sizeOf**(`externalArgs`: ExternalArgsApi, `value`: any): *number*

*Defined in [internal/sizeOf.ts:27](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/sizeOf.ts#L27)*

**UNRELIABLE YET**

Calculate the size (bytes) of the given value.
Also validates that the value is saveable

**Parameters:**

Name | Type |
------ | ------ |
`externalArgs` | ExternalArgsApi |
`value` | any |

**Returns:** *number*

___

###  updateExternalArgs

▸ **updateExternalArgs**(`objectBuffer`: any, `options`: Partial‹ExternalArgsApi›): *void*

*Defined in [internal/api.ts:228](https://github.com/Bnaya/objectbuffer/blob/49fce16/src/internal/api.ts#L228)*

Allows to update external args passed to createObjectBuffer

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | any |
`options` | Partial‹ExternalArgsApi› |

**Returns:** *void*
