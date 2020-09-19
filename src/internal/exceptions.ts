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

export class WrapperDestroyed extends Error {
  constructor() {
    super("WrapperDestroyed");
  }
}
