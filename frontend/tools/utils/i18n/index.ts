import { DEFAULT_LOCALE } from '..';
import {
  TranslationService,
  TranslationsLoader,
  TranslationsVerifier,
} from './service';

export function makeTranslationService(
  defaultLocale = DEFAULT_LOCALE
): TranslationService {
  return new TranslationService(
    defaultLocale,
    new TranslationsLoader(),
    new TranslationsVerifier(defaultLocale)
  );
}
