'use client';

import { useMemo } from 'react';

export function useLog() {
  return useMemo(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO
      error: (...args: any[]) => {
        console.error(...args);
      },
    }),
    []
  );
}
