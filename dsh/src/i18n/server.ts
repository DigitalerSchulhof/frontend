export { getServerT } from './t/server';

import { DEFAULT_LOCALE } from '#/utils';
import { ClientTranslations } from './context';
import { TranslationService } from './service';

const translationService = new TranslationService(DEFAULT_LOCALE);

const clientTranslationsMap = new Map<string, ClientTranslations>();

export function getOrMakeClientTranslations(
  locale: string
): ClientTranslations {
  const cachedTranslations = clientTranslationsMap.get(locale);
  if (cachedTranslations) return cachedTranslations;

  const defaultTranslations =
    translationService.getOrLoadTranslations(DEFAULT_LOCALE);
  const translations = translationService.getOrLoadTranslations(locale);

  const clientTranslations: ClientTranslations = {};

  for (const key of defaultTranslations.keys()) {
    const translation = translations.get(key) ?? defaultTranslations.get(key)!;

    clientTranslations[key] = {
      type: translation.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ast: (translation as any).ast,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      asts: (translation as any).asts,
    };
  }

  clientTranslationsMap.set(locale, clientTranslations);

  return clientTranslations;
}
