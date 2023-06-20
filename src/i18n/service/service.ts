import { DEFAULT_LOCALE } from '#/utils';
import { TranslationEntry, loadTranslations } from './loader';
import { verifyTranslations } from './verifier';

const localeTranslations = new Map<string, Map<string, TranslationEntry>>();

const defaultTranslations = loadTranslations(DEFAULT_LOCALE);

if (!verifyTranslations(defaultTranslations, defaultTranslations)) {
  throw new Error('Default translations are not valid.');
}

localeTranslations.set(DEFAULT_LOCALE, defaultTranslations);

export function getTranslations(locale: string): Map<string, TranslationEntry> {
  const cachedTranslations = localeTranslations.get(locale);
  if (cachedTranslations) return cachedTranslations;

  const translations = loadTranslations(locale);
  mergeTranslationsWithDefault(translations, defaultTranslations);
  const valid = verifyTranslations(translations, defaultTranslations);

  if (!valid) {
    console.warn(
      'Translations are not valid. Using default translations instead.'
    );
    return defaultTranslations;
  }

  localeTranslations.set(locale, translations);
  return translations;
}

/**
 * Side effect: Mutates the translations map.
 */
function mergeTranslationsWithDefault(
  translations: Map<string, TranslationEntry>,
  defaultTranslations: ReadonlyMap<string, TranslationEntry>
): void {
  for (const [key, defaultTranslation] of defaultTranslations) {
    if (!translations.has(key)) {
      translations.set(key, defaultTranslation);
    }
  }
}
