import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { yieldModules, readJsonSync, yieldFiles, flattenObject } from './utils';

export interface TranslationEntry {
  value: string;
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
export const packageTranslations = new Map<
  string,
  Map<string, Map<string, TranslationEntry>>
>();

/**
 * @key package name
 * @value default locale
 */
export const packageDefaultLocale = new Map<string, string>();

function loadTranslations() {
  for (const dir of yieldModules()) {
    if (!fs.existsSync(path.join(dir, 'locales'))) continue;

    const pkg = readJsonSync(`${dir}/package.json`);
    if ('defaultLocale' in pkg.dsh === false) {
      throw new Error(`Missing defaultLocale in ${pkg.name}`);
    }
    packageDefaultLocale.set(pkg.name, pkg.defaultLocale);

    const locales = new Map<string, Map<string, TranslationEntry>>();
    for (const locale of fs.readdirSync(path.join(dir, 'locales'))) {
      if (!locales.has(locale)) locales.set(locale, new Map());
      const map = locales.get(locale)!;

      for (const localeFile of yieldFiles(path.join(dir, 'locales', locale))) {
        let content = yaml.parse(fs.readFileSync(localeFile, 'utf-8'));
        const localePrefix = localeFile
          .substring(
            path.join(dir, 'locales', locale).length + 1,
            localeFile.length - '.yml'.length
          )
          .split('/')
          .join('.');

        for (const [key, value] of Object.entries(
          flattenObject(content, '.')
        )) {
          map.set(`${localePrefix}.${key}`, {
            value: value as string,
            file: localeFile,
          });
        }
      }
    }
    if (!locales.has(pkg.dsh.defaultLocale)) {
      throw new Error(
        `Missing defaultLocale in ${pkg.name}: ${pkg.dsh.defaultLocale}`
      );
    }

    for (const k in locales.get(pkg.dsh.defaultLocale)!) {
      for (const locale of locales) {
        if (locale[1].has(k)) continue;
        locale[1].set(k, locales.get(pkg.dsh.defaultLocale)!.get(k)!);
      }
    }

    packageTranslations.set(pkg.name, locales);
  }
}
loadTranslations();

export function reloadTranslations() {
  packageTranslations.clear();
  packageDefaultLocale.clear();
  loadTranslations();
}

export function getTranslation(
  packageName: string,
  key: string,
  locale: string
): string {
  if (key.includes(':')) {
    [packageName, key] = key.split(':');
  }

  const translations =
    packageTranslations.get(packageName)?.get(locale) ??
    packageTranslations
      .get(packageName)
      ?.get(packageDefaultLocale.get(packageName)!);

  if (!translations) throw new Error(`Missing translations for ${packageName}`);

  if (!translations.has(key)) return key;

  return translations.get(key)!.value;
}

export function getTranslationOrigin(
  packageName: string,
  key: string,
  locale: string
): string | null {
  if (key.includes(':')) {
    [packageName, key] = key.split(':');
  }

  const translations = packageTranslations.get(packageName)?.get(locale);

  if (!translations) throw new Error(`Missing translations for ${packageName}`);

  if (!translations.has(key)) return null;

  return translations.get(key)!.file;
}
