export class BigInt64OverflowError extends RangeError {
  constructor() {
    super("BigInt64OverflowError");
  }
}

export class IllegalObjectPropConfigError extends RangeError {
  constructor() {
    super("IllegalObjectPropConfigError");
  }
}

export class IllegalArrayIndexError extends RangeError {
  constructor() {
    super("IllegalArrayIndexError");
  }
}

export class UnsupportedOperationError extends Error {
  constructor() {
    super("UnsupportedOperationError");
  }
}

export class OutOfMemoryError extends Error {
  constructor() {
    super("OutOfMemoryError");
  }
}
