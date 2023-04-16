'use client';

import { createRef, useCallback, useRef, useState } from 'react';

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

export function useRefs<const Ids extends readonly string[]>(
  ids: Ids
): Record<Ids[number], React.RefObject<HTMLInputElement>> {
  const refsRef = useRef<{
    ids: readonly string[];
    refs: Record<Ids[number], React.RefObject<HTMLInputElement>>;
  } | null>(null);

  if (refsRef.current === null) {
    refsRef.current = { ids, refs: createRefs(ids) };
  } else if (
    ids.length !== Object.keys(refsRef.current.refs).length ||
    ids.some((id, idx) => refsRef.current!.ids[idx] !== id)
  ) {
    refsRef.current = { ids, refs: createRefs(ids) };
  }

  return refsRef.current.refs;
}

function createRefs<const Ids extends readonly string[]>(
  ids: Ids
): Record<Ids[number], React.RefObject<HTMLInputElement>> {
  return ids.reduce((acc, id) => {
    // @ts-expect-error -- Object access
    acc[id] = createRef<HTMLInputElement>();
    return acc;
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter -- Not sure why this is necessary, but it is
  }, {} as Record<Ids[number], React.RefObject<HTMLInputElement>>);
}
