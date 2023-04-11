import { DEFAULT_LOCALE } from '#/utils';
import { getOrMakeClientTranslations } from '.';
import { makeTFunction } from '../common/function';
import { TContext } from '../common/utils';

export function getServerT(): TContext {
  // TODO: Extract locale from request
  const locale = DEFAULT_LOCALE;

  const translations = getOrMakeClientTranslations(locale);

  return {
    t: makeTFunction(translations, locale),
    translations,
  };
}
