import type { TFunction } from '#/i18n/function';
import { makeTFunction } from '#/i18n/function';
import { DEFAULT_LOCALE } from '#/utils';
import type { ClientTranslations } from './client-translations';
import { getClientTranslations } from './client-translations';

export interface BackendI18nContext {
  t: TFunction;
  clientTranslations: ClientTranslations;
}

export function createI18nContext(): BackendI18nContext {
  const locale = DEFAULT_LOCALE;

  const clientTranslations = getClientTranslations(locale);

  return {
    t: makeTFunction(clientTranslations, locale),
    clientTranslations,
  };
}
