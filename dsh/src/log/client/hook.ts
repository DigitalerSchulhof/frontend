'use client';

import { useMemo } from 'react';

export function useLog() {
  return useMemo(
    () => ({
      error: (...args: any[]) => {
        console.error(...args);
      },
    }),
    []
  );
}
