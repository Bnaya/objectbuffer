// The entry file of your WebAssembly module.

export * from "./functional";

export function add(a: i32, b: i32): i32 {
  return a + b;
}
