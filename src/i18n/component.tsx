/* eslint-disable react-hooks/rules-of-hooks -- Component works as both Client and Server Component. We don't memo if on the server. */
import { useMemo } from 'react';
import { useT } from './hook';
import type { Translations } from './translations';

export type TProps<K extends keyof Translations> = {
  t: K;
} & (Translations[K]['variables'] extends [unknown]
  ? {
      args: Translations[K]['variables'][0];
    }
  : { args?: never });

export const T = <const K extends keyof Translations>({
  t,
  args,
}: TProps<K>): JSX.Element => {
  if (typeof window === 'undefined') {
    const { t: tFunc } = useT();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <>{tFunc(t, args as any)}</>;
  }

  const { t: tFunc } = useT();

  return useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <>{tFunc(t, args as any)}</>;
  }, [t, args, tFunc]);
};
