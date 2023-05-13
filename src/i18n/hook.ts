// Both Client and Server Hook

import { useSettings } from '#/settings/client';
import { useContext, useMemo } from 'react';
import { TFunction, makeTFunction } from './function';
import { translationsContext } from './context';

export function useT(): { t: TFunction } {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../auth/component').getContext();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const translations = useContext(translationsContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const settings = useSettings();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(
    () => ({
      t: makeTFunction(translations, settings.locale),
    }),
    [translations, settings.locale]
  );
}
