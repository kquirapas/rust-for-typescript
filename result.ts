// Adapting Rust's Result<T, E> construct for
// a robust error handling system

// Error is a serializable (Jsonable) object
// see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#description
export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

// base error class to separate message from metadata
export class BaseError extends Error {
  public context?: Jsonable;

  constructor(
    message: string,
    options: { error?: Error; context?: Jsonable } = {},
  ) {
    const { error, context } = options;

    super(message, { cause: error });
    this.name = this.constructor.name;

    this.context = context;
  }

  withContext(ctx: Jsonable): this {
    this.context = ctx;
    return this;
  }
}

export type Success<T> = { success: true; result: T };
export type Failure<E extends BaseError> = { success: false; result: E };

export type Result<T, E extends BaseError> = Success<T> | Failure<E>;

//---------- UTILS ----------

// wrap a value in Success<T>
export function ok<T>(value: T): Success<T> {
  return { success: true, result: value };
}

// wrap an error in Failure<E>
export function err<E extends BaseError>(value: E): Failure<E> {
  return { success: false, result: value };
}

// extract result value with no care if it's
// success or failure
export function unwrap<T, E extends BaseError>(result: Result<T, E>) {
  return result.result;
}

// either extract result value if it's a success
// or rethrow the underlying error
//
// used for propagating / hoisting errors to the next handler
export function unwrapOrThrow<T, E extends BaseError>(result: Result<T, E>): T {
  if (result.success == true) {
    return result.result;
  } else {
    throw result.result;
  }
}
