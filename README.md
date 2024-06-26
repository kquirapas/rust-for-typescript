# Rust for Typescript

Adapting Rust constructs in Typescript

# Usage

```typescript
export function idlFromFile(path: string): Result<anchor.Idl, FileLoadError> {
  try {
    const idl = JSON.parse(fs.readFileSync(path).toString()) as anchor.Idl;
    return ok(idl);
  } catch (e) {
    return err(new FileLoadError(path));
  }
}
```

# Table of Contents

**Important Note**: Your `tsconfig.json` `target` and `lib` should be `es2022` because `class BaseError extends Error` uses the `Error.cause` metadata.

## result.ts

### Objective

- Explicitly color `fallible` functions with a `Result<T, E>` to distinguish functions with possible errors with their signatures only

- Also containts `anyhow-rs` `with_context()` construct as a convenience function for adding `{ context: Jsonable }` to any `BaseError`

### API

Definitions

`class BaseError` - This class extends the `Error` object and adds a serializable `context` in the `Error` metadata.

`type Jsonable` - `Errors` in Javascript should be serializablel. This is a convenience type for making sure data within errors are serializable.

`type Success<S>` - The equivalent type T used in Rust's Result<T, E>.

`type Failure<F>` - The equivalent type E used in Rust's Result<T, E>.

`type Result<T, E extends BaseError>` - The equivalent Result<T, E> type in Rust.

Utilities

`function ok<T>(value: T)` - The equivalent `Ok()` in Rust.

`function err<E extends BaseError>(value: E)` - The equivalent `Err()` in Rust.

`function unwrap<T, E extends BaseError>(result: Result<T, E>)` - The equivalent `unwrap()` in Rust.

`function unwrapOrThrow<T, E extends BaseError>(result: Result<T, E>)` - Custom `unwrap()` function used for propagating errors to the next handler
