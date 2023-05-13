import { DEFAULT_LOCALE } from '#/utils';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { TranslationService } from './service';

export type ClientTranslations = Record<
  string,
  | {
      type: 'string';
      ast: MessageFormatElement[];
    }
  | {
      type: 'array';
      asts: MessageFormatElement[][];
    }
>;

const translationService = new TranslationService(DEFAULT_LOCALE);

const clientTranslationsMap = new Map<string, ClientTranslations>();

export function getClientTranslations(locale: string): ClientTranslations {
  const cachedTranslations = clientTranslationsMap.get(locale);
  if (cachedTranslations) return cachedTranslations;

  const clientTranslations = createClientTranslations(locale);

  clientTranslationsMap.set(locale, clientTranslations);

  return clientTranslations;
}

function createClientTranslations(locale: string): ClientTranslations {
  const defaultTranslations =
    translationService.getOrLoadTranslations(DEFAULT_LOCALE);
  const translations = translationService.getOrLoadTranslations(locale);

  const clientTranslations: ClientTranslations = {};

  for (const key of defaultTranslations.keys()) {
    const translation = translations.get(key) ?? defaultTranslations.get(key)!;

    clientTranslations[key] = {
      type: translation.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- If it's not set, it just falls back to 'undefined'
      ast: (translation as any).ast,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- If it's not set, it just falls back to 'undefined'
      asts: (translation as any).asts,
    };
  }

  return clientTranslations;
}
