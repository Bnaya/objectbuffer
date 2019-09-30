// isolated due to parser changes ts 3.7
// https://github.com/microsoft/TypeScript/pull/32695
// eslint-disable-next-line prettier/prettier
// export function assertNonNull<T>(v: T): asserts v is NonNullable<T> {
//   if (v === undefined || v === null) {
//     throw new Error("assertNonNull");
//   }
// }

/**
 * @template T
 * @param {T} v
 * @return {asserts v is NonNullable<T>}
 */
export function assertNonNull(v) {
  if (v === undefined || v === null) {
    throw new Error("assertNonNull");
  }
}
