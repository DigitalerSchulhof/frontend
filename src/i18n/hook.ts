// Both Client and Server Hook

import { useSettings } from '#/settings/client';
import { useContext, useMemo } from 'react';
import { TFunction, makeTFunction } from './function';
import { translationsContext } from './context';
import { ClientTranslations } from '#/context/contexts/i18n/client-translations';

export function useT(): { t: TFunction; translations: ClientTranslations } {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { t, clientTranslations } = require('../auth/component').getContext();
    return { t, translations: clientTranslations };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const translations = useContext(translationsContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const settings = useSettings();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(
    () => ({
      t: makeTFunction(translations, settings.locale),
      translations,
    }),
    [translations, settings.locale]
  );
}
