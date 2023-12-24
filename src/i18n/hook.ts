// Both Client and Server Hook

import { useContext, useMemo } from 'react';
import type { TFunction } from './function';
import { makeTFunction } from './function';
import { translationsContext } from './context';
import type { ClientTranslations } from '#/context/contexts/i18n/client-translations';

export function useT(): { t: TFunction; translations: ClientTranslations } {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { t, clientTranslations } = require('../auth/component').getContext();
    return { t, translations: clientTranslations };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const translations = useContext(translationsContext);
  // TODO: Config
  const locale = 'de-DE';

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(
    () => ({
      t: makeTFunction(translations, locale),
      translations,
    }),
    [translations, locale]
  );
}
