'use client';

import { useContext } from 'react';
import { TFunction, makeTFunction } from '../common/function';
import { translationsContext } from './context';
import { useSettings } from '#/settings/client';

export function useT(): { t: TFunction } {
  const translations = useContext(translationsContext);
  const settings = useSettings();

  return {
    t: makeTFunction(translations, settings.locale),
  };
}
