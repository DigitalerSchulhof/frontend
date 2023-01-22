import {
  MessageFormatElement,
  parse,
} from '@formatjs/icu-messageformat-parser';
import fs from 'fs';
import globby from 'globby';
import path from 'path';
import yaml from 'yaml';
import { flattenObject, __frontend, __root } from '.';

export const DEFAULT_LOCALE = 'de-DE' as string;
export const LOCALE = require(path.join(__root, 'settings.json'))
  .locale as string;

const _locales = path.join(__frontend, 'locales');

export type TranslationEntry = {
  file: string;
  key: string;
} & (
  | {
      type: 'string';
      value: string;
      ast: MessageFormatElement[];
    }
  | {
      type: 'array';
      values: string[];
      asts: MessageFormatElement[][];
    }
);

/**
 * @key - the locale
 * @value {
 *   @key - the translation key
 * }
 */
let translations: Record<string, Record<string, TranslationEntry>>;

export function getTranslations(locale = DEFAULT_LOCALE) {
  if (!translations) loadTranslations();

  if (locale in translations === false) {
    throw new Error(`Locale ${locale} is not supported.`);
  }

  return translations[locale];
}

export function loadTranslations(): void {
  translations = {};

  translations[DEFAULT_LOCALE] = loadLocaleTranslations(DEFAULT_LOCALE);
  for (const locale of fs.readdirSync(_locales)) {
    if (locale === DEFAULT_LOCALE) continue;

    translations[locale] = loadLocaleTranslations(locale);
    for (const [key, value] of Object.entries(translations[DEFAULT_LOCALE])) {
      if (key in translations[locale]) {
        if (
          typeof translations[DEFAULT_LOCALE][key] !==
          typeof translations[locale][key]
        ) {
          console.warn(
            `Translation key '${key}' in locale '${locale}' has a different type than in the default locale '${DEFAULT_LOCALE}'`
          );
        }
      } else {
        translations[locale][key] = value;
      }
    }
  }
}

function loadLocaleTranslations(
  locale: string
): Record<string, TranslationEntry> {
  const localeTranslations: Record<string, TranslationEntry> = {};
  const translationFiles = globby.sync('**/*.yml', {
    cwd: path.join(_locales, locale),
  });

  for (const translationFile of translationFiles) {
    const translationPathPrefix = translationFile
      .substring(0, translationFile.length - '.yml'.length)
      .replace(/\//g, '.');

    const translation = yaml.parse(
      fs.readFileSync(path.join(_locales, locale, translationFile), 'utf-8')
    );

    const translations = flattenObject(translation, '.') as Record<
      string,
      string | string[]
    >;

    for (const [key, value] of Object.entries(translations)) {
      let translationKey = (
        translationPathPrefix.replace(/\.index$/, '') +
        '.' +
        key
      ).replace(/(^\.|\.index\.?$|\.$)/g, '');

      const entry = {
        file: path.join(_locales, locale, translationFile),
        key: translationKey,
      };

      if (typeof value === 'string') {
        localeTranslations[translationKey] = {
          ...entry,
          type: 'string',
          value,
          ast: parse(value),
        };
      } else {
        localeTranslations[translationKey] = {
          ...entry,
          type: 'array',
          ...value.reduce<
            Pick<TranslationEntry & { type: 'array' }, 'values' | 'asts'>
          >(
            (acc, v) => {
              acc.values.push(v);
              acc.asts.push(parse(v));
              return acc;
            },
            { values: [], asts: [] }
          ),
        };
      }
    }
  }

  return localeTranslations;
}

export function getTranslation(
  key: string,
  locale = DEFAULT_LOCALE
): TranslationEntry | undefined {
  const translations = getTranslations(locale);

  return translations[key];
}
