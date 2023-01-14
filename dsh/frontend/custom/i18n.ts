import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { flattenObject, readJsonSync, yieldFiles, yieldModules } from './utils';

export interface TranslationEntry {
  value: string | string[];
  file: string;
}

/**
 * @key package name
 * @value {
 *   @key locale code
 *   @value {
 *     @key i18n key
 *     @value TranslationEntry
 *   }
 * }
 */
export let packageTranslations: Record<
  string,
  Record<string, Record<string, TranslationEntry>>
> = {};

/**
 * @key package name
 * @value default locale
 */
export let packageDefaultLocale: Record<string, string> = {};

function loadTranslations() {
  for (const [dir] of yieldModules()) {
    if (!fs.existsSync(path.join(dir, 'locales'))) continue;

    const pkg = readJsonSync(`${dir}/package.json`);
    if ('defaultLocale' in pkg.dsh === false) {
      throw new Error(`Missing defaultLocale in ${pkg.name}`);
    }
    packageDefaultLocale[pkg.name] = pkg.dsh.defaultLocale;

    const locales: Record<string, Record<string, TranslationEntry>> = {};
    for (const locale of fs.readdirSync(path.join(dir, 'locales'))) {
      if (locale in locales === false) locales[locale] = {};
      const map = locales[locale];

      for (const localeFile of yieldFiles(path.join(dir, 'locales', locale))) {
        let content = yaml.parse(fs.readFileSync(localeFile, 'utf-8'));
        const localePrefix = localeFile
          .substring(
            path.join(dir, 'locales', locale).length + 1,
            localeFile.length - '.yml'.length
          )
          .split('/')
          .join('.');

        if (content === null) continue;

        for (const [key, value] of Object.entries(
          flattenObject(content, '.')
        )) {
          map[`${localePrefix}.${key}`] = {
            value: value as string,
            file: localeFile,
          };
        }
      }
    }
    if (pkg.dsh.defaultLocale in locales === false) {
      throw new Error(
        `Missing defaultLocale in ${pkg.name}: ${pkg.dsh.defaultLocale}`
      );
    }

    for (const locale in locales) {
      locales[locale] = {
        ...locales[pkg.dsh.defaultLocale],
        ...locales[locale],
      };
    }

    packageTranslations[pkg.name] = locales;
  }
}
loadTranslations();

export function reloadTranslations() {
  packageTranslations = {};
  packageDefaultLocale = {};
  loadTranslations();
}

export function getTranslation(
  packageName: string,
  key: string,
  locale: string
): string | string[] {
  if (key.includes(':')) {
    [packageName, key] = key.split(':');
  }

  const translations =
    packageTranslations[packageName]?.[locale] ??
    packageTranslations[packageName]?.[packageDefaultLocale[packageName]];

  if (!translations) throw new Error(`Missing translations for ${packageName}`);

  return translations[key]?.value ?? key;
}

export function getTranslationOrigin(
  packageName: string,
  key: string,
  locale: string
): string | null {
  if (key.includes(':')) {
    [packageName, key] = key.split(':');
  }

  const translations = packageTranslations[packageName]?.[locale];

  if (!translations) throw new Error(`Missing translations for ${packageName}`);

  return translations[key]?.file ?? null;
}
