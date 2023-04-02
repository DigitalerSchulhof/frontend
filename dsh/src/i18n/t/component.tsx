import { useT } from '#/i18n/t/hook';
import { Translations, TranslationsWithStringType } from '#/i18n/translations';

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
    return (
      import('#/i18n/server')
        .then((m) => m.getServerT().t)
        // This assertion works because server components are able to render Promise<JSX.Element> as well
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((tFunc) => <>{tFunc(t, args as any)}</>) as unknown as JSX.Element
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- This is for this component to work both on the server and the client
  const { t: tFunc } = useT();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <>{tFunc(t, args as any)}</>;
};
