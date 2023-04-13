'use client';

import { useCallback, useState } from 'react';

export function useToggle(
  initialValue = false
): [
  state: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void
] {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);
  const toggle = useCallback(() => setValue((value) => !value), [setValue]);

  return [value, setTrue, setFalse, toggle];
}
