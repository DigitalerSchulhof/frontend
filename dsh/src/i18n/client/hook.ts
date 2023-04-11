'use client';

import { useContext, useMemo } from 'react';
import { TFunction, makeTFunction } from '../common/function';
import { ClientTranslations, translationsContext } from './context';
import { useSettings } from '#/settings/client';

export function useT(): { t: TFunction; translations: ClientTranslations } {
  const translations = useContext(translationsContext);
  const settings = useSettings();

  const tFunc = useMemo(
    () => makeTFunction(translations, settings.locale),
    [translations, settings.locale]
  );

  return useMemo(
    () => ({
      t: tFunc,
      translations,
    }),
    [tFunc, translations]
  );
}
