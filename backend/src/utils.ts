/* eslint-disable @typescript-eslint/no-explicit-any */
export type MaybeArray<T> = T | T[];
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type DeepNonNull<T> = T extends object
  ? { [K in keyof T]-?: DeepNonNull<NonNullable<T[K]>> }
  : NonNullable<T>;

/**
 * The identity function.
 */
export function identity<T>(x: T): T {
  return x;
}

/**
 * Returns whether the given `PromiseSettledResult` is a `PromiseRejectedResult`.
 */
export function isPromiseRejectedResult<T>(
  val: PromiseSettledResult<T>
): val is PromiseRejectedResult {
  return val.status === 'rejected';
}

/**
 * Returns the given value, but replaces `null` with `undefined`.
 *
 * @example
 * ```ts
 * const limit = withoutNull(args.limit);
 * //    ^ number | undefined     ^ number | null |  undefined
 * ```
 */
// With these overloads we don't add `undefined` to types that aren't nullable in the first place
export function withoutNull<T>(value: NonNullable<T>): T;
export function withoutNull<T>(value: T | null): T | undefined;
export function withoutNull<T>(val: T | null): T | undefined {
  return val === null ? undefined : val;
}

export function deepWithoutNull<T>(val: NonNullable<T>): DeepNonNull<T>;
export function deepWithoutNull<T>(val: T | null): DeepNonNull<T> | undefined;
export function deepWithoutNull<T>(val: T | null): DeepNonNull<T> | undefined {
  if (val === null) return undefined;

  if (typeof val === 'object') {
    const result: any = {};
    for (const key in val) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      result[key] = deepWithoutNull(val[key]);
    }
    return result;
  }

  return val as any;
}

/**
 * Returns `true` for values other than `null` and `undefined`.
 *
 * @example
 * ```ts
 * const numberArray = numberOrNullArray.filter(isNotNullUndefined);
 * //    ^ number[]    ^ (number | null)[]
 * ```
 */
export function isNotNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

const REFERENCE_COMPARATOR = <T>(a: T, b: T) => a === b;

/**
 * Filters out duplicate values with an optional comparator function and returns the new array.
 * @param comparator A function that takes two values and returns `true` if they should be considered identical
 *
 * @example
 * ```ts
 * unique([1, 2, 3, 2, 1]); // -> [1, 2, 3]
 * unique([{ id: 1 }, { id: 2 }, { id: 1 }], (a, b) => a.id === b.id); // -> [{ id: 1 }, { id: 2 }]
 * ```
 */
export function unique<T>(
  arr: readonly T[],
  comparator: (a: T, b: T) => boolean = REFERENCE_COMPARATOR
): T[] {
  if (arr.length === 0) return [];
  // If the comparator is the default one, we can use a Set to filter out duplicates since it's much faster
  if (comparator === REFERENCE_COMPARATOR) return [...new Set(arr)];

  return arr.filter((val, i) => arr.findIndex((v) => comparator(v, val)) === i);
}

export function toArray<T>(maybeArray: MaybeArray<T>): T[] {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

export class ToCatchError extends Error {
  constructor(message?: string) {
    super(
      message ??
        'This error should be caught and handled. If you see this, there is an error handler missing.'
    );
  }
}

export class MissingDependencyError extends Error {
  constructor(name: string) {
    super(`Missing dependency: ${name}`);
  }
}
