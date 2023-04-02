import { getOrMakeClientTranslations } from '#/i18n/server';
import { DEFAULT_LOCALE } from '#/utils';
import { TFunction, makeTFunction } from './function';

export function getServerT(): { t: TFunction } {
  // TODO: Extract locale from request
  const locale = DEFAULT_LOCALE;

  const translations = getOrMakeClientTranslations(locale);

  return {
    t: makeTFunction(translations, locale),
  };
}
