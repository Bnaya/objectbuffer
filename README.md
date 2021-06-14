# ObjectBuffer: object-like API, backed by a [shared]arraybuffer

[![npm version](https://badge.fury.io/js/%40bnaya%2Fobjectbuffer.svg)](https://badge.fury.io/js/%40bnaya%2Fobjectbuffer)
[![Coverage Status](https://coveralls.io/repos/github/Bnaya/objectbuffer/badge.svg)](https://coveralls.io/github/Bnaya/objectbuffer) [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Bnaya/objectbuffer)   


For Modern browsers and node.

Save, read and update plain javascript objects into `ArrayBuffer`, using regular javascript object api,
without intermediate serialization/deserialization.  

No pre-defined schema is required.
In other words, It's a user-land implementation of javascript objects, using a single ArrayBuffer as the heap.

That's enables us to `transfer` or share objects  with a `WebWorker` or other, same-origin, browsing contexts without data duplication or  full serialization.

## 🐉🐉🐉 Adventurers Beware 🐉🐉🐉
Using this library, and workers in general, will not necessarily make you code runs faster.  
First be sure where your bottlenecks are, and if you don't have a better and more simple workaround.  
I personally also really like what's going on around the [main thread scheduling proposal](https://github.com/WICG/main-thread-scheduling) and [react userland scheduler](https://www.npmjs.com/package/scheduler) that powers concurrent react

## Quick example

```js
import { createObjectBuffer, getUnderlyingArrayBuffer } from "@bnaya/objectbuffer";

const initialValue = {
  foo: { bar: new Date(), arr: [1], nesting:{ WorksTM: true } }
};
// ArrayBuffer is created under the hood
const myObject = createObjectBuffer(
  {},
  // size in bytes
  1024,
  initialValue
);

const arrayBuffer = getUnderlyingArrayBuffer(myObject);

myObject.additionalProp = "new Value";
myObject.arr.push(2);

```

## Play with it (codesandbox)

* [Sort Array on worker (comlink)](https://codesandbox.io/s/objectbuffer-comlink-demo-sort-array-on-webworker-no-data-copy-je3ni)
* [Sort Array on worker (no comlink)](https://codesandbox.io/s/objectbuffer-demo-sort-array-on-webworker-no-data-copy-xmpl5)

See also [main.js](playground/main.js) for shared memory example.
to run it: clone the repo, `yarn install` and `yarn browser-playground`

## Getting involved

Participants is Adhere to the [Code of Conduct](./CODE_OF_CONDUCT.md).  
The quickest way to get up and running is via [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Bnaya/objectbuffer) and to run the tests.

Go over the [contributing document](CONTRIBUTING.md).  
Pick an issue with ["good first" or "help wanted"](https://github.com/Bnaya/objectbuffer/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22), or do some cool by your own!

Feel free to open an issue, or contact me directly at [me@bnaya.net](mailto:me@bnaya.net)

## API reference

[link](docs/generated/README.md)

## Why

Exchanging plain objects with `WebWorkers` is done by serializing and copying the data to the other side.  
for some use-cases, it's slow and memory expensive.  
`ArrayBuffer` can be `transferred` without a copy, and `SharedArrayBuffer` can be directly shared, but out of the box, it's hard to use `ArrayBuffer` as more than a [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays).  
## Disclaimer / Motivation

I'm working on it mostly from personal interest, It's not in use in any production use-case.  
Before putting any eggs in the basket, please go over the [implementation details document](docs/implementationDetails.md)

## What's working

* strings
* number
* objects (with nesting and all)
* arrays
* Date
* BigInt
* Internal references (`foo.bar2 = foo.bar` will not create a copy, but a reference)
* Automatic reference counting, to dispose a value you need to use the `disposeWrapperObject` or to have WeakRef support
* Internal equality between objects (`foo.bar === foo.bar` will be true)
* global lock for shared memory using [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) (I hope its really working)

## Caveats & Limitations

* Need to specify size for the `ArrayBuffer`. When exceed that size, exception will be thrown. (Can be extended later with a utility function, but not automatically)
* Size must be multiplication of 8
* Set, Map, Object keys can be only string or numbers. no symbols or other things
* No prototype chain. no methods on the objects
* Adding getters, setters, will not work/break the library
* deleting/removing the current key of Map/Set while iteration will make you skip the next key [#60](https://github.com/Bnaya/objectbuffer/issues/60)

### What's not working yet, but can be

* `bigint` bigger than 64 bit

### What's probably never going to work

* Anything that cannot go into `JSON.stringify`
* `Symbol`

## If you came this far, you better also look at:
* [GoogleChromeLabs/buffer-backed-object](https://github.com/GoogleChromeLabs/buffer-backed-object#readme) 
* [FlatBuffers](https://google.github.io/flatbuffers/flatbuffers_guide_use_javascript.html)
* And there must be more of these, look them up
