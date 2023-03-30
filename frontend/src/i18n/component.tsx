'use client';

import { useTranslations } from '#/i18n/t';
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
}: TProps<K>) => {
  const { t: tFunc } = useTranslations();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <>{tFunc(t, args as any)}</>;
};
