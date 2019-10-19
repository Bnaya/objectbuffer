# ObjectBuffer: object-like API, backed by a [shared]arraybuffer

For Modern browsers and node. Zero direct dependencies.

Save, read and update plain javascript objects into `ArrayBuffer` (And not only TypedArrays),  using regular javascript object api, without serialization/deserialization.  
Look at it as a simple implementation of javascript objects in user-land.

That's enables us to `transfer` or share objects in-memory with `WebWorker` without additional memory or serialization

The library is still not `1.0`, but already usable, and will never offer full compatibility with plain js (`Symbol` and such)

For in-depth overview of how things are implemented, see [implementation details document](docs/implementationDetails.md)

## Quick example

```js
import { createObjectBuffer, getUnderlyingArrayBuffer } from "@bnaya/objectbuffer";

const initialValue = {
  foo: { bar: new Date(), arr: [1], nesting:{ WorksTM: true } }
};
// ArrayBuffer is created under the hood
const myObject = createObjectBuffer(
  {
    // available globally in the browser, or inside `util` in node
    textEncoder: new TextEncoder(),
    textDecoder: new TextDecoder()
  },
  // size in bytes
  1024,
  initialValue
);

const arrayBuffer = getUnderlyingArrayBuffer(myObject);

myObject.additionalProp = "new Value";
myObject.arr.push(2);

```

## Play with it

[![Edit objectbuffer demo - SharedArrayBuffer](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/objectbuffer-demo-sharedarraybuffer-tf3il?fontsize=14&module=%2Fsrc%2Findex.ts)

See also [main.js](playground/main.js) for shared memory example.
to run it: clone the repo, `yarn install` and `yarn browser-playground`

## API reference

[link](docs/generated/README.md)

## Why

Exchanging plain objects with `WebWorkers` is done by serializing and copying the data to the other side.  
for some use-cases, it's slow and memory expensive.  
`ArrayBuffer` can be `transferred` without a copy, and `SharedArrayBuffer` can be directly shared, but out of the box, it's hard to use `ArrayBuffer` as more than a [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays).  

## Why not [FlatBuffers](https://github.com/google/flatbuffers)

For many cases FlatBuffers is the right tool!  
FlatBuffers requires full re-serialization when changing values. inside. The api is also more different than javascript objects.

## Disclaimer / Motivation

I'm working on it mostly from personal interest, and i'm not using it for any project yet.  
Before putting any eggs in the basket, please go over the [implementation details document](docs/implementationDetails.md)

## What's working

* strings
* number
* objects (with nesting and all)
* arrays
* Date
* Internal references (`foo.bar2 = foo.bar` will not create a copy)
* Internal equality between objects (`foo.bar === foo.bar` will be true)
* global lock for shared memory using [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) (i hope its really working)

## Caveats & Limitations

* Need to specify size for the `ArrayBuffer`. When exceed that size, exception will be thrown. (Can be extended with a utility function, but not automatically)
* Not memory re-use. memory allocation is append based, or overwrite when possible [#21](https://github.com/Bnaya/objectbuffer/issues/21)
* Object are implemented using simple linked list [#26](https://github.com/Bnaya/objectbuffer/issues/26)
* Maps & Sets are not supported yet [#15](https://github.com/Bnaya/objectbuffer/issues/15) & [#24](https://github.com/Bnaya/objectbuffer/issues/24)
* No prototype chain. objects props will simply be copied
* Additional props on Array, Date, primitives will not be saved.
* getters, setters, will not work/break the library

### What's not working yet, but can be

* `bigint` bigger than 64 bit

### What's probably never going to work (convince me otherwise )

* Anything that cannot go into `JSON.stringify`
* `Symbol`

## Contribution / Collaboration

There's a huge place for optimizations, code hygiene, and features!  
Feel free to open issues and maybe implementing missing parts
