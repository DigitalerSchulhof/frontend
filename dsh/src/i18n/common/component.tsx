import { useT } from '../client';
import { Translations, TranslationsWithStringType } from '../translations';

export type TProps<K extends keyof Translations> = {
  t: K;
} & (Translations[K]['variables'] extends [unknown]
  ? {
      args: Translations[K]['variables'][0];
    }
  : { args?: never });

export const T = <K extends TranslationsWithStringType>({
  t,
  args,
}: TProps<K>): JSX.Element => {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { t: tFunc } = require('../server').getServerT();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <>{tFunc(t, args as any)}</>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- This is for this component to work both on the server and the client
  const { t: tFunc } = useT();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <>{tFunc(t, args as any)}</>;
};
