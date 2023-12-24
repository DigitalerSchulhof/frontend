'use client';

import type { WrappedActionResult } from '#/utils/action';
import { useCallback, useState } from 'react';

export type ClientFormOfAddress = 'informal' | 'formal';

export class ServerActionError extends Error {
  constructor(
    readonly code: string,
    readonly baggage?: Record<string, unknown>
  ) {
    super(`Client Error: ${code}`);
  }
}

export class AggregateServerActionError extends AggregateError {
  constructor(errors: readonly ServerActionError[]) {
    super(errors, `Client Errors: ${errors.map((e) => e.code).join(', ')}`);
  }
}

/**
 * Awaits and unwraps the results from a Server Action.
 *
 * Errors not wrapped, but thrown by the Action instead are re-thrown.
 */
export async function unwrapAction<R>(
  actionResult: Promise<WrappedActionResult<R>>
): Promise<R> {
  const result = await actionResult;

  if (result.code === 'NOT_OK') {
    if (!result.data.length) {
      throw new ServerActionError('INTERNAL_ERROR');
    } else if (result.data.length === 1) {
      const [{ code }] = result.data;
      throw new ServerActionError(code);
    } else {
      throw new AggregateServerActionError(
        result.data.map(({ code }) => new ServerActionError(code))
      );
    }
  }

  return result.data;
}

export function useToggle(
  initialValue = false
): [
  state: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
] {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);
  const toggle = useCallback(() => setValue((v) => !v), [setValue]);

  return [value, setTrue, setFalse, toggle];
}

export function useBitState(initialValue = 0): [
  state: number,
  /**
   * Creates a set function for the given bit.
   */
  createSet: (bit: number) => (value: boolean) => void,
  /**
   * Creates a toggle function for the given bit.
   */
  createToggle: (bit: number) => () => void,
  setAll: (value: number) => void,
] {
  const [value, setValue] = useState(initialValue);

  const createSet = useCallback(
    (bit: number) => (val: boolean) =>
      setValue((v) => (val ? v | (1 << bit) : v & ~(1 << bit))),
    [setValue]
  );

  const createToggle = useCallback(
    (bit: number) => () => setValue((v) => v ^ (1 << bit)),
    [setValue]
  );

  const setAll = useCallback((val: number) => setValue(val), [setValue]);

  return [value, createSet, createToggle, setAll];
}
