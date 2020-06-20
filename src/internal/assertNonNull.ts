/* istanbul ignore file */
export function assertNonNull<T>(v: T): asserts v is NonNullable<T> {
  if (v === undefined || v === null) {
    throw new Error("assertNonNull");
  }
}
