import { ClientTranslations } from '#/i18n/client';
import { DEFAULT_LOCALE } from '#/utils';
import { getOrMakeClientTranslations } from '.';
import { TFunction, makeTFunction } from '../common/function';

export function getServerT(): {
  t: TFunction;
  translations: ClientTranslations;
} {
  // TODO: Extract locale from request
  const locale = DEFAULT_LOCALE;

  const translations = getOrMakeClientTranslations(locale);

  return {
    t: makeTFunction(translations, locale),
    translations,
  };
}
