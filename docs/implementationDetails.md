# Implementation details

## Terminology/Assorted details

* Pointer: `Uint32` that holds the index in the array of a value
* ArrayBuffer values are initialized to `0`. pointer with value `0` means `undefined`
* We depend on externally provided [WHATWG encoding apis](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API) to encode and decode strings.
* `AB` = `ArrayBuffer`

### ArrayBuffer and internal memory allocation

* You need to specify the size for the underlying ArrayBuffer. to know how to estimate the needed size, or how to extend the underlying ArrayBuffer, read ahead.

* Global 4GB limit: Internal pointers are saved as `uint32`, so the max size of the ArrayBuffer most be smaller than `2^32`.

* The 24 first bytes of the ArrayBuffer are reserved for:
  * `Int32` Lock [Atomics.wait](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait)
  * `Uint32` pointer to first free byte. initialized to `24`
  * `Uint32` pointer for the top level initial value object entry.

#### Append or immediate overwrite. no reuse

For simplicity, there's no full allocator.
We just append we keep the first-free-byte in a known location, save new data from there and forward, and update the value.  
When in place update of a value is possible (eg update number to another number, `count++`), we do so, to avoid memory waste.  
To compact the memory you can save the object into a new ObjectBuffer.

### How do we read value from a pointer

We use something called `entry` to describe a value on the memory.
Each entry has a header byte (`Uint8`) that tells us the type. see `entry-types.ts` ENUM for actual value.  
Some of the entries type has same size, some not

### fixed-size primitive entries

* `number` header byte + `Float64`
* `boolean` header byte + `Uint8` (`0` or `1`)
* `bigint` Positive header byte + BigUint64. max value is `2^63 − 1`
* `bigint` Negative header byte + BigUint64 min value is `(2^63 − 1) * -1`
* `null` header byte (TODO just point to index `1`)
* `undefined` header byte (TODO just point to index `0`)

### More complex value types

### `string`

Memory representation

* `Uint8` header
* `Uint16` string length (in bytes, not `"str".length`)
* `Uint16` reserved allocated size
* encoded string data itself + reserved space if any

Why do we need string length & allocated size?
So you can overwrite a string with a shorter one, and then longer again, without wasting the memory.
There is also an option when creating ObjectBuffer to always allocate a minimum size for string entries. the default value is `0`.  you may set it by your own heuristics

### `Date` (most of the code in `dateWrapper.ts`)

Memory representation

* `Uint8` header
* `Float64` UTC time in milliseconds

The external api of `Date` is a Proxy, that traps calls to a known list of methods.  
Operations are done on a shadow Date object. we do setTime with the value from the `AB` before the operation. if it's get operation we just return the value returned from the shadow Date.
if it's a set operation we also set the value `from date.getTime()` back into the `AB`.
The API surface of `Date` is huge (like 50 methods), but they basicity do the same so there's a tricky to just configure the functions in an array, and reuse the impl

### `Array`

* `Uint8` header
* `Uint32` length of the array. `arr.length`
* `Uint32` reserved allocated length
* `Uint32` pointer to the "array values pointers"
  * -> Array values Pointers `Uint32` * **reserved** array length

Array access is O(1). api is a Proxy. See `arrayWrapper.ts`

To access index `[n]`, we simply calculate the pointer address using `valuesPointerAddress + n * Uint32.size`.  
When an operation is shrinking the length of the array, we just to update the array entry with the new length.  
But when an operation is **extending** the size of the array,
we check if the reserved array length have the space we need, and use it.  
**if not**, to keep our array contiguous, we move the value pointers to the free area of the `AB` with the new length, and update the array entry accordingly. the array entry itself stays in the same place!

Array `in-place` methods are also implemented in the lib. mostly not depends on the built-in behavior, it was supposed to be more efficient, maybe its not needed any more (?)

### `Object` Implemented as a linked list (`objectWrapper.ts`)

Starts with an entry of type `OBJECT` + pointer to a entry of a type `OBJECT_PROP`, that is the first prop in the object.  
A `OBJECT_PROP` entry contains header byte, the key of the property (length in `Uint32` + string data), a pointer `Uint32` to the value entry and a pointer to the next property of the object.  
The order of the properties does not match the ECMA spec, as numerical keys will not come before string keys.

### How does reference saving works

To understand what it means, let take a look at:

```javascript
const externalUserObject = { name: "" };
const objectBuffer = createObjectBuffer({}, ...);

// This will copy the object inside our ObjectBuffer
objectBuffer.userObject = externalUserObject
objectBuffer.userObject === externalUserObject // false

// This will create another reference to the same object, as regular javascript
objectBuffer.anotherUserObject = objectBuffer.userObject
objectBuffer.anotherUserObject.name = "New User Name"
objectBuffer.userObject.name === objectBuffer.anotherUserObject.name; // true
```

When assigning a none-primitive value (`Object`, `Array`, `Date`) to a object prop/array, we first check if it has internally known symbol.
if it does, we simple take the entry address of the given value, and use it instead of creating a new copy.

### How does objects comparison works

To understand what it means, let take a look at:

```js
const externalUserObject = { name: "" };
const objectBuffer = createObjectBuffer({}, ...);

// This will copy the object inside our ObjectBuffer
objectBuffer.userObject = externalUserObject
objectBuffer.anotherUserObject = objectBuffer.userObject

objectBuffer.userObject === externalUserObject // false
objectBuffer.userObject === objectBuffer.anotherUserObject; // true
objectBuffer.userObject === objectBuffer.userObject; // true
```

When getting an object, like `userObject` a proxy is returned. if we would create a new proxy instance for every time we access `userObject`,
even things like `objectBuffer.userObject === objectBuffer.userObject` would be falsy.
So what we do is holding a WeakMap-based cache of created proxies.  
The first level of cache is a WeakMap where the key is the `DataView` being used on that specific instance of the ObjectBuffer, and the second level is a map between the address of the `Object` entry to our Proxy.

## Why explicit size is needed

`ArrayBuffer`/`SharedArrayBuffer` requires specific size to be created. and VM allocates the memory on that point.  
There is no javascript API to extend `AB`/`SAB` in place [Even not that one](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer).  
So the lib can't extend the underlying `AB`, just to create a new one.  
When you need more space, use the `resizeObjectBuffer` explicitly.  
Why the lib can't do it by itself? Because it changes the `ArrayBuffer`.
For use cases like Shared Memory, if one of the processes will swap the ArrayBuffer without coordinating it with the others, he will just point to a different data.
Doing that coordinating is out of the scope of the lib.

## How to choose the size i need

The initial size must fit the initial data passed to `createObjectBuffer`.  
You may use the sizeof function that calculate the size of the given value, but a **rule of thumb** is "the size of the data in JSON form, without the line breaks and space + 5%".  
To that, you need to add additional space for operations that will require more space.  
To check how much free space left, use `spaceLeft`.

## What will happen if i

* Exceed the size of the buffer: Exception (`OutOfMemoryError`) will be thrown
* use object.defineProperty: Exception(`UnsupportedOperationError`) will be thrown
* use object.setPrototype: Exception(`UnsupportedOperationError`) will be thrown
* Use Symbol as key: Exception(`IllegalObjectPropConfigError`) will be thrown
* Set string key on array, negative number: Exception(`IllegalArrayIndexError`) will be thrown
* Set anything on directly on Date: Exception(`UnsupportedOperationError`) will be thrown
* Overflow int64 (negative or positive): Exception(BigInt64OverflowError) will be thrown
