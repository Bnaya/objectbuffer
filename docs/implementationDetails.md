# Some Implementation details

## Terminology/Assorted details

* Pointer: `Uint32` that holds the index in the array of a value
* ArrayBuffer values are initialized to `0`. pointer with value `0` means `undefined`
* <s>We depend on externally provided [WHATWG encoding apis](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API) to encode and decode strings.</s> The lib has internal impl of string decoders/encoders due to incompatibilities of the node & browser ones 
* `AB` = `ArrayBuffer`

## ArrayBuffer and internal memory allocation

* You need to specify the size for the underlying ArrayBuffer. to know how to estimate the needed size, or how to extend the underlying ArrayBuffer, read ahead.

* Global 4GB limit: Internal pointers are saved as `uint32`, so the max size of the ArrayBuffer most be smaller than `2^32`.

* The 24 first bytes of the ArrayBuffer are reserved for:
  * `Int32` Lock [Atomics.wait](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait)
  * `Uint32` pointer to first free byte. initialized to `24`
  * `Uint32` pointer for the top level initial value object entry.


## Allocator in use: [@thi.ng/malloc](https://www.npmjs.com/package/@thi.ng/malloc)

* **Endianness is platform specific** ArrayBuffers are in use
* Part of the magnificent [thi-ng/umbrella](https://github.com/thi-ng/umbrella) project  
* [Memory layout](https://github.com/thi-ng/umbrella/tree/master/packages/malloc#memory-layout)  
* All allocations are aligned to 8 bytes [#72](https://github.com/Bnaya/objectbuffer/issues/72)  


## Freeing no-longer accessible memory (Automatic Reference counting)

When setting a new value to a object property,
The old value is may be unacceptable any more from the javascript side, and you may reclaim the memory. JS engines has GC to figure that out, but we don't.

So what we do have is **reference counting!**  
Every `Object`, `Array`, `Map`, `Set`, `Date` have ref count (inside the arraybuffer memory ofc), that we update when add a new reference to it, or removing reference. example:
```js
const objectBuffer = createObjectBuffer(...,{foo: ["a", "b", "c"]});

// This will increment the reference count
objectBuffer.fooAnotherRef = objectBuffer.foo;

// This will decrement it
delete objectBuffer.foo;
```

### ....But there's more!
When we access `objectBuffer.foo` a Proxy object is returned to us, that is another reference to the target memory. so that's also increment the count.  
Only one proxy is created for each target, per process(worker, node thread, etc) and cached by each one of them.  
When [proposal-weakrefs](https://github.com/tc39/proposal-weakrefs) is enabled, the library will use it to figure when the proxy objects are not longer accessible, dispose them, and decrement the count.  
But until then, there's a manual function, `disposeWrapperObject` that will make the given proxy object unusable, and decrement the count.  
Behind all that there's a complex machinery, that covered with tests (But more are always good!)


## How do we read value from a pointer

We use something called `entry` to describe a value on the memory.
Each entry has a header byte (`Uint8`) that tells us the type. see `entry-types.ts` ENUM for actual value.  
Some of the entries type has same size, some not

### fixed-size primitive entries

* `number` header byte + `Float64`
* `boolean` header byte + `Uint8` (`0` or `1`)
* `bigint` Positive header byte + BigUint64. max value is `2^63 − 1`
* `bigint` Negative header byte + BigUint64 min value is `(2^63 − 1) * -1`

### Known addresses
* `UNDEFINED_KNOWN_ADDRESS = 0`
* `NULL_KNOWN_ADDRESS = 1`
* `TRUE_KNOWN_ADDRESS = 2`
* `TRUE_KNOWN_ADDRESS = 2;`

### More complex value types

### `string`

Memory representation

* `Uint8` header
* `Uint16` string length (in bytes, not `"str".length`)
* encoded string data itself

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

### `Object`, `Map`, `Set` are implemented as a linked-hashmap

They have pretty annoying memory overhead until we do something about it: [#69](https://github.com/Bnaya/objectbuffer/issues/69)


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

## How to choose the size I need

The initial size must fit the initial data passed to `createObjectBuffer`.  
You may use the sizeof function that calculate the size of the given value, but a **rule of thumb** is "the size of the data in JSON form, without the line breaks and space + 5%".  
To that, you need to add additional space for operations that will require more space.  
To check how much free space left, use `spaceLeft`.

## What will happen if I

* Exceed the size of the buffer: Exception (`OutOfMemoryError`) will be thrown
* use object.defineProperty: Exception(`UnsupportedOperationError`) will be thrown
* use object.setPrototype: Exception(`UnsupportedOperationError`) will be thrown
* Use Symbol as key: Exception(`IllegalObjectPropConfigError`) will be thrown
* Set string key on array, negative number: Exception(`IllegalArrayIndexError`) will be thrown
* Set anything on directly on Date: Exception(`UnsupportedOperationError`) will be thrown
* Overflow int64 (negative or positive): Exception(BigInt64OverflowError) will be thrown
