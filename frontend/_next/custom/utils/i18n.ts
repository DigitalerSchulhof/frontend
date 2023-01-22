import {
  MessageFormatElement,
  parse,
} from '@formatjs/icu-messageformat-parser';
import chokidar from 'chokidar';
import fs from 'fs';
import globby from 'globby';
import path from 'path';
import { EventEmitter } from 'stream';
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

  for (const translationPath of translationFiles) {
    loadTranslationFile(locale, translationPath, localeTranslations);
  }

  return localeTranslations;
}

/**
 * Side effects: localeTranslations
 */
function loadTranslationFile(
  locale: string,
  translationPath: string,
  localeTranslations: Record<string, TranslationEntry>
) {
  const translationPathPrefix = translationPath
    .substring(0, translationPath.length - '.yml'.length)
    .replace(/\//g, '.');

  const translation = yaml.parse(
    fs.readFileSync(path.join(_locales, locale, translationPath), 'utf-8')
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
      file: path.join(_locales, locale, translationPath),
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

export function getTranslation(
  key: string,
  locale = DEFAULT_LOCALE
): TranslationEntry | undefined {
  const translations = getTranslations(locale);

  return translations[key];
}

interface TranslationsWatcher extends EventEmitter {
  on(event: 'change', listener: (locale: string) => void): this;
}

export function watchTranslations(): TranslationsWatcher {
  const emitter = new EventEmitter();

  const watcher = chokidar
    .watch('.', {
      cwd: _locales,
      ignoreInitial: true,
      persistent: true,
    })
    .on('add', (p) => {
      const [locale, ...translationsPath] = p.split(path.sep);

      loadTranslationFile(
        locale,
        translationsPath.join(path.sep),
        translations[locale]
      );
      emitter.emit('change', locale);
    })
    .on('change', (p) => {
      const [locale, ...translationsPath] = p.split(path.sep);

      // Delete old translations
      for (const key of Object.keys(translations[locale])) {
        if (translations[locale][key].file === path.join(_locales, p)) {
          delete translations[locale][key];
        }
      }

      loadTranslationFile(
        locale,
        translationsPath.join(path.sep),
        translations[locale]
      );
      emitter.emit('change', locale);
    })
    .on('unlink', (p) => {
      const [locale] = p.split(path.sep);

      // Delete old translations
      for (const key of Object.keys(translations[locale])) {
        if (translations[locale][key].file === path.join(_locales, p)) {
          delete translations[locale][key];
        }
      }

      emitter.emit('change', locale);
    });

  process.on('exit', () => {
    watcher.close();
  });

  return emitter;
}
