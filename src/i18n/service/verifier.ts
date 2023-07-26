import type { TranslationEntry } from '.';

/**
 * @returns Whether all translations are valid.
 */
export function verifyTranslations(
  translations: ReadonlyMap<string, TranslationEntry>,
  defaultTranslations: ReadonlyMap<string, TranslationEntry>,
  printErrors = true
): boolean {
  let hasError = false;

  for (const [key, translation] of translations) {
    if (translations !== defaultTranslations) {
      const defaultTranslation = defaultTranslations.get(key);

      if (!defaultTranslation) {
        if (printErrors) {
          console.error(
            `Translation for key ${key} in file ${translation.file} not found in default locale.`
          );
        }
        hasError = true;

        continue;
      }

      if (translation.type !== defaultTranslation.type) {
        if (printErrors) {
          console.error(
            `Translation type for key ${key} in file ${translation.file} (${translation.type}) does not match default translation type (${defaultTranslation.type}).`
          );
        }
        hasError = true;
      }
    }
  }

  return !hasError;
}
