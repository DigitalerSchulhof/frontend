import {
  deepWithoutNull,
  identity,
  isNotNullOrUndefined,
  isPromiseRejectedResult,
  toArray,
  unique,
  withoutNull,
} from '../utils';

test('identity()', () => {
  expect(identity(1)).toBe(1);
  expect(identity('foo')).toBe('foo');
  expect(identity(true)).toBe(true);
  expect(identity(false)).toBe(false);
  expect(identity(null)).toBe(null);
  expect(identity(undefined)).toBe(undefined);
});

test('isPromiseRejectedResult()', () => {
  expect(isPromiseRejectedResult({ status: 'fulfilled', value: 1 })).toBe(
    false
  );
  expect(isPromiseRejectedResult({ status: 'rejected', reason: 1 })).toBe(true);
});

test('withoutNull()', () => {
  expect(withoutNull(0)).toBe(0);
  expect(withoutNull(1)).toBe(1);
  expect(withoutNull('')).toBe('');
  expect(withoutNull('foo')).toBe('foo');
  expect(withoutNull(true)).toBe(true);
  expect(withoutNull(false)).toBe(false);
  expect(withoutNull(null)).toBe(undefined);
  expect(withoutNull(undefined)).toBe(undefined);
});

test('deepWithoutNull()', () => {
  expect(deepWithoutNull(0)).toBe(0);
  expect(deepWithoutNull(null)).toBe(undefined);
  expect(deepWithoutNull(undefined)).toBe(undefined);
  expect(deepWithoutNull({ foo: null })).toEqual({ foo: undefined });
  expect(deepWithoutNull({ foo: 1, bar: null })).toEqual({
    foo: 1,
    bar: undefined,
  });
  expect(deepWithoutNull({ foo: 1, bar: { baz: null } })).toEqual({
    foo: 1,
    bar: { baz: undefined },
  });
  expect(deepWithoutNull({ foo: 1, bar: { baz: 2 } })).toEqual({
    foo: 1,
    bar: { baz: 2 },
  });
});

test('isNotNullOrUndefined()', () => {
  expect(isNotNullOrUndefined(0)).toBe(true);
  expect(isNotNullOrUndefined(1)).toBe(true);
  expect(isNotNullOrUndefined('')).toBe(true);
  expect(isNotNullOrUndefined('foo')).toBe(true);
  expect(isNotNullOrUndefined(true)).toBe(true);
  expect(isNotNullOrUndefined(false)).toBe(true);
  expect(isNotNullOrUndefined(null)).toBe(false);
  expect(isNotNullOrUndefined(undefined)).toBe(false);
});

describe('unique()', () => {
  it('filters by reference by default', () => {
    expect(unique([])).toEqual([]);

    const a = { foo: 1 };
    const b = { foo: 1 };
    const c = { foo: 1 };

    expect(unique([a, b, c, a, b, c])).toEqual([a, b, c]);
  });

  it('uses a custom comparator', () => {
    const a = { foo: 1 };
    const b = { foo: 1 };
    const c = { foo: 2 };

    expect(unique([a, b, c, a, b, c], (a, b) => a.foo === b.foo)).toEqual([
      a,
      c,
    ]);
  });
});

test('toArray()', () => {
  expect(toArray(1)).toEqual([1]);
  expect(toArray([1])).toEqual([1]);
});
