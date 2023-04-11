'use client';

import { useSettings } from '#/settings/client';
import { useContext, useMemo } from 'react';
import { makeTFunction } from '../common/function';
import { TContext } from '../common/utils';
import { translationsContext } from './context';

export function useT(): TContext {
  const translations = useContext(translationsContext);
  const settings = useSettings();

  return useMemo(
    () => ({
      t: makeTFunction(translations, settings.locale),
      translations,
    }),
    [translations, settings.locale]
  );
}
