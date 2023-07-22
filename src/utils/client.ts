'use client';

import type { WrappedActionResult } from '#/utils/action';
import { useCallback, useState } from 'react';

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

export async function unwrapAction<R>(
  actionResult: Promise<WrappedActionResult<R>>
): Promise<R> {
  const result = await actionResult;

  if (result.code === 'NOT_OK') {
    if (!result.data.length) {
      throw new ServerActionError('UNKNOWN_ERROR');
    } else if (result.data.length === 1) {
      const [{ code, ...baggage }] = result.data;
      throw new ServerActionError(code, baggage);
    } else {
      throw new AggregateServerActionError(
        result.data.map(
          ({ code, ...baggage }) => new ServerActionError(code, baggage)
        )
      );
    }
  }

  return result.data;
}
