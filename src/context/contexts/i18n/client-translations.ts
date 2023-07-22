import { expandTranslations, getTranslations } from '#/i18n/service';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';

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

const clientTranslationsMap = new Map<string, ClientTranslations>();

export function getClientTranslations(locale: string): ClientTranslations {
  const cachedTranslations = clientTranslationsMap.get(locale);
  if (cachedTranslations) return cachedTranslations;

  const clientTranslations = createClientTranslations(locale);

  clientTranslationsMap.set(locale, clientTranslations);

  return clientTranslations;
}

function createClientTranslations(locale: string): ClientTranslations {
  const translations = getTranslations(locale);
  const expandedTranslations = expandTranslations(translations);

  const clientTranslations: ClientTranslations = {};

  for (const [key, translation] of expandedTranslations) {
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
