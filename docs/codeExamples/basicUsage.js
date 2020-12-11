import { createObjectBuffer } from "@bnaya/objectbuffer";

const initialValue = {
  foo: { bar: new Date() },
  arrayInside: [1, "a", null],
  arrayBufferRocks: 1,
};
const myObject = createObjectBuffer(1024, initialValue);

myObject.arrayInside.push("another entry");
myObject.foo.anotherProperty = "value";

console.log(JSON.stringify(myObject));
