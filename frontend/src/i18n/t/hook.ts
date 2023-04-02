'use client';

import { translationsContext } from '#/i18n/context';
import { settingsContext } from '#/settings/context';
import { useContext } from 'react';
import { TFunction, makeTFunction } from './function';

export function useT(): { t: TFunction } {
  const translations = useContext(translationsContext);
  const settings = useContext(settingsContext);

  return {
    t: makeTFunction(translations, settings.locale),
  };
}
