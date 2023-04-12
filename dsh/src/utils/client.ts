'use client';

import { useCallback, useState } from 'react';

export function useToggle(
  initialValue = false
): [state: boolean, setTrue: () => void, setFalse: () => void] {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);

  return [value, setTrue, setFalse];
}
