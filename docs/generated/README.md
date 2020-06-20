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
* [updateExternalArgs](README.md#updateexternalargs)

## Type aliases

###  CreateObjectBufferOptions

Ƭ **CreateObjectBufferOptions**: *CreateObjectBufferOptions*

*Defined in [index.ts:22](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/index.ts#L22)*

___

###  ExternalArgs

Ƭ **ExternalArgs**: *object*

*Defined in [index.ts:21](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/index.ts#L21)*

#### Type declaration:

## Functions

###  acquireLock

▸ **acquireLock**(`agentId`: number, `objectBuffer`: any): *boolean*

*Defined in [internal/locks.ts:19](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/locks.ts#L19)*

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

*Defined in [internal/locks.ts:66](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/locks.ts#L66)*

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

▸ **createObjectBuffer**‹**T**›(`externalArgs`: ExternalArgsApi, `size`: number, `initialValue`: T, `options`: CreateObjectBufferOptions): *T*

*Defined in [internal/api.ts:38](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L38)*

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

*Defined in [internal/disposeWrapperObject.ts:11](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/disposeWrapperObject.ts#L11)*

 Dispose the given objectWrapper, and re-claim the memory

**`see`** collectGarbage for systems that supports WeakRef

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

###  getUnderlyingArrayBuffer

▸ **getUnderlyingArrayBuffer**(`objectBuffer`: unknown): *ArrayBuffer | SharedArrayBuffer*

*Defined in [internal/api.ts:116](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L116)*

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | unknown |

**Returns:** *ArrayBuffer | SharedArrayBuffer*

___

###  loadObjectBuffer

▸ **loadObjectBuffer**‹**T**›(`externalArgs`: ExternalArgsApi, `arrayBuffer`: ArrayBuffer | SharedArrayBuffer): *T*

*Defined in [internal/api.ts:131](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L131)*

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

▸ **memoryStats**(`objectBuffer`: unknown): *MemoryStats*

*Defined in [internal/api.ts:206](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L206)*

Return the number of free & used bytes left in the given objectBuffer

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | unknown |

**Returns:** *MemoryStats*

___

###  releaseLock

▸ **releaseLock**(`agentId`: number, `objectBuffer`: any): *boolean*

*Defined in [internal/locks.ts:37](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/locks.ts#L37)*

 Try to release a lock acquired by [acquireLock](README.md#acquirelock) or [acquireLockWait](README.md#acquirelockwait)

**Parameters:**

Name | Type |
------ | ------ |
`agentId` | number |
`objectBuffer` | any |

**Returns:** *boolean*

___

###  replaceUnderlyingArrayBuffer

▸ **replaceUnderlyingArrayBuffer**(`objectBuffer`: unknown, `newArrayBuffer`: ArrayBuffer | SharedArrayBuffer): *void*

*Defined in [internal/api.ts:174](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L174)*

Replace the Underlying array buffer with the given one.
The given ArrayBuffer is expected to be a copy of the prev ArrayBuffer,
just bigger or smaller (less free space)

Consider using `resizeObjectBuffer`

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`objectBuffer` | unknown | - |
`newArrayBuffer` | ArrayBuffer &#124; SharedArrayBuffer |   |

**Returns:** *void*

___

###  resizeObjectBuffer

▸ **resizeObjectBuffer**(`objectBuffer`: unknown, `newSize`: number): *ArrayBuffer*

*Defined in [internal/api.ts:99](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L99)*

Grow or shrink the underlying ArrayBuffer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`objectBuffer` | unknown | - |
`newSize` | number |   |

**Returns:** *ArrayBuffer*

___

###  updateExternalArgs

▸ **updateExternalArgs**(`objectBuffer`: unknown, `options`: Partial‹ExternalArgsApi›): *void*

*Defined in [internal/api.ts:226](https://github.com/Bnaya/objectbuffer/blob/3aa5699/src/internal/api.ts#L226)*

Allows to update external args passed to createObjectBuffer

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | unknown |
`options` | Partial‹ExternalArgsApi› |

**Returns:** *void*
