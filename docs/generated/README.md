[objectbuffer](undefined) › ["index"](README.md)

# External module: "index"

Basic usage (Browser):

```js
import { createObjectBuffer } from "@bnaya/objectbuffer";

const initialValue = {
  foo: { bar: new Date() },
  arrayInside: [1, "a", null],
  arrayBufferRocks: 1
};
const myObject = createObjectBuffer(
  {
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  },
  1024,
  initialValue
);

myObject.arrayInside.push("another entry");
myObject.foo.anotherProperty = "value";

console.log(JSON.stringify(myObject));

```

## Index

### Type aliases

* [CreateObjectBufferOptions](README.md#createobjectbufferoptions)
* [ExternalArgs](README.md#externalargs)

### Functions

* [acquireLock](README.md#acquirelock)
* [acquireLockWait](README.md#acquirelockwait)
* [createObjectBuffer](README.md#createobjectbuffer)
* [getUnderlyingArrayBuffer](README.md#getunderlyingarraybuffer)
* [loadObjectBuffer](README.md#loadobjectbuffer)
* [releaseLock](README.md#releaselock)
* [replaceUnderlyingArrayBuffer](README.md#replaceunderlyingarraybuffer)
* [resizeObjectBuffer](README.md#resizeobjectbuffer)
* [sizeOf](README.md#sizeof)
* [spaceLeft](README.md#spaceleft)

## Type aliases

###  CreateObjectBufferOptions

Ƭ **CreateObjectBufferOptions**: *[CreateObjectBufferOptions](undefined)*

*Defined in [index.ts:21](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/index.ts#L21)*

___

###  ExternalArgs

Ƭ **ExternalArgs**: *object*

*Defined in [index.ts:20](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/index.ts#L20)*

#### Type declaration:

## Functions

###  acquireLock

▸ **acquireLock**(`agentId`: number, `objectBuffer`: any): *boolean*

*Defined in [internal/locks.ts:14](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/locks.ts#L14)*

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

*Defined in [internal/locks.ts:61](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/locks.ts#L61)*

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

▸ **createObjectBuffer**<**T**>(`externalArgs`: [ExternalArgsApi](undefined), `size`: number, `initialValue`: T, `options`: [CreateObjectBufferOptions](undefined)): *T*

*Defined in [internal/api.ts:28](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/api.ts#L28)*

Create a new objectBuffer, with the given initial value

the initial value has to be an object.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`externalArgs` | [ExternalArgsApi](undefined) | - |
`size` | number | - |
`initialValue` | T | - |
`options` | [CreateObjectBufferOptions](undefined) |  {} |

**Returns:** *T*

___

###  getUnderlyingArrayBuffer

▸ **getUnderlyingArrayBuffer**(`objectBuffer`: any): *ArrayBuffer | SharedArrayBuffer*

*Defined in [internal/api.ts:78](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/api.ts#L78)*

**Parameters:**

Name | Type |
------ | ------ |
`objectBuffer` | any |

**Returns:** *ArrayBuffer | SharedArrayBuffer*

___

###  loadObjectBuffer

▸ **loadObjectBuffer**<**T**>(`externalArgs`: [ExternalArgsApi](undefined), `arrayBuffer`: ArrayBuffer | SharedArrayBuffer): *T*

*Defined in [internal/api.ts:93](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/api.ts#L93)*

Create objectBuffer object from the given ArrayBuffer

The given ArrayBuffer is expected to be one obtained via getUnderlyingArrayBuffer
This operation doesn't change any value in the ArrayBuffer

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`externalArgs` | [ExternalArgsApi](undefined) | - |
`arrayBuffer` | ArrayBuffer &#124; SharedArrayBuffer |   |

**Returns:** *T*

___

###  releaseLock

▸ **releaseLock**(`agentId`: number, `objectBuffer`: any): *boolean*

*Defined in [internal/locks.ts:32](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/locks.ts#L32)*

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

*Defined in [internal/api.ts:117](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/api.ts#L117)*

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

*Defined in [internal/api.ts:61](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/api.ts#L61)*

Grow or shrink the underlying ArrayBuffer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`objectBuffer` | any | - |
`newSize` | number |   |

**Returns:** *ArrayBuffer*

___

###  sizeOf

▸ **sizeOf**(`externalArgs`: [ExternalArgs](README.md#externalargs), `value`: any): *number*

*Defined in [internal/sizeOf.ts:12](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/sizeOf.ts#L12)*

Calculate the size (bytes) of the given value.
Also validates that the value is saveable

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`externalArgs` | [ExternalArgs](README.md#externalargs) | - |
`value` | any |   |

**Returns:** *number*

___

###  spaceLeft

▸ **spaceLeft**(`objectBuffer`: any): *number*

*Defined in [internal/api.ts:147](https://github.com/Bnaya/objectbuffer/blob/fe29e82/src/internal/api.ts#L147)*

Return the number of free bytes left in the given objectBuffer

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`objectBuffer` | any |   |

**Returns:** *number*
