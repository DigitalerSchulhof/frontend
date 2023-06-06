import { TYPE } from '@formatjs/icu-messageformat-parser';
import { TranslationEntry } from '.';
import { flattenAst } from './loader';

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
    const asts = flattenAst(translation);

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

    for (const ast of asts) {
      if (ast.type !== TYPE.template) break;

      const referencedKey = ast.value;

      const referencedTranslation = translations.get(referencedKey);

      if (!referencedTranslation) {
        if (printErrors) {
          console.error(
            `Referenced key ${referencedKey} referenced translation for key ${key} in file ${translation.file} not found.`
          );
        }
        hasError = true;
        continue;
      }

      if (referencedTranslation.type !== 'string') {
        if (printErrors) {
          console.error(
            `Referenced key ${referencedKey} referenced translation for key ${key} in file ${translation.file} is not a string.`
          );
        }
        hasError = true;
      }
    }
  }

  return !hasError;
}
