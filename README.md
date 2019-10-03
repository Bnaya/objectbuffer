# WIP: object-like API, backed by a [shared]arraybuffer

For Modern browsers and node. Zero direct dependencies.

The library offers you an API that have the look & feel of a regular javascript object, but the data is saved to an `ArrayBuffer` that can be shared or transferred to a `WebWorker`.  
The library is still not complete, and will never offer full compatibility with plain js objects due, to the nature of the language and the problems space.

## Play with it:

[![Edit objectbuffer demo - SharedArrayBuffer](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/objectbuffer-demo-sharedarraybuffer-tf3il?fontsize=14&module=%2Fsrc%2Findex.ts)

See also [main.js](playground/main.js) for shared memory example.
to run it: clone the repo, `yarn install` and `yarn browser-playground`

## Why?

Exchanging data with `WebWorkers` (other than ArrayBuffer) is done by serializing and copying the data to the other side.  
for some use-cases, it's slow and memory expensive.
`ArrayBuffer` can be `transferred` without a copy, and `SharedArrayBuffer` can be directly shared, but out of the box, it's hard to use `ArrayBuffer` as more than a [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays).  

`SharedArrayBuffer` and `ArrayBuffer`

## Motivation

Personal interest. Maybe will be useful as shared memory primitive, and communicating with WASM. Maybe state management with shared memory across workers?

## What do we have in hand?

It's working! but very unoptimized (eg objects are simple linked lists), only append data (no logic to reuse unreachable memory)
and its not extending the backing `arraybuffer` size by itself.
if you exceed the sb size, an exception will be thrown.  
[ArrayBuffer.prototype.transfer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer) is still not supported anywhere, so we can't do that efficiently anyhow

### What's working:

* Kinda whatever that can go into `JSON.stringify`
* objects
* arrays (without methods yet)
* global lock using [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) (i hope its really working)

### Missing parts

* `array` methods
* `Date`
* `Map` On primitive key/value
* `Set` On primitive values

### What's not working yet, but can be:

* `bigint` bigger than 64 bit

### What's probably never going to work (convince me otherwise in an issue):

* Anything that cannot go into `JSON.stringify`
* `Symbol`
* Circularities

### "design" doc:

[Design DOC](https://docs.google.com/document/d/1-UlUyH3HgOrN58avyScZlfjQtfJxgVwK_yE35mQHpYw/edit?usp=sharing)

## Contribution / Collaboration

There's a huge place for optimizations, code hygiene, and features!  
Feel free to open issues and maybe implementing missing parts
