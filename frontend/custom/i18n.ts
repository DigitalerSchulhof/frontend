import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { yieldModules, readJsonSync, yieldFiles, mergeObjects } from './utils';

/**
 * @key package name
 * @value {
 *   @key locale code
 *   @value translations tree
 * }
 */
export const packageTranslations = new Map<
  string,
  Map<string, Record<string, any>>
>();

/**
 * @key package name
 * @value {
 *   @key locale code
 *   @value translations tree
 * }
 */
export const mergedPackageTranslations = new Map<
  string,
  Map<string, Record<string, any>>
>();

/**
 * @key package name
 * @value default locale
 */
export const packageDefaultLocale = new Map<string, string>();

for (const dir of yieldModules()) {
  if (!fs.existsSync(path.join(dir, 'locales'))) continue;

  const pkg = readJsonSync(`${dir}/package.json`);
  if ('defaultLocale' in pkg.dsh === false) {
    throw new Error(`Missing defaultLocale in ${pkg.name}`);
  }

  packageDefaultLocale.set(pkg.name, pkg.defaultLocale);

  const locales = new Map<string, Record<string, any>>();
  for (const locale of fs.readdirSync(path.join(dir, 'locales'))) {
    if (!locales.has(locale)) locales.set(locale, {});

    for (const localeFile of yieldFiles(path.join(dir, 'locales', locale))) {
      let content = yaml.parse(fs.readFileSync(localeFile, 'utf-8'));
      const filePrefix = localeFile
        .substring(
          path.join(dir, 'locales', locale).length + 1,
          localeFile.length - '.yml'.length
        )
        .split('/');

      for (let i = filePrefix.length - 1; i >= 0; i--) {
        content = { [filePrefix[i]]: content };
      }

      locales.set(locale, mergeObjects(locales.get(locale)!, content));
    }
  }
  if (!locales.has(pkg.dsh.defaultLocale)) {
    throw new Error(
      `Missing defaultLocale in ${pkg.name}: ${pkg.dsh.defaultLocale}`
    );
  }

  packageTranslations.set(pkg.name, locales);

  const mergedLocales = new Map<string, Record<string, any>>();
  for (const locale of fs.readdirSync(path.join(dir, 'locales'))) {
    const l = locales.get(locale)!;
    const dl = locales.get(pkg.dsh.defaultLocale)!;

    mergedLocales.set(locale, mergeObjects(dl, l, false));
  }
  mergedPackageTranslations.set(pkg.name, mergedLocales);
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
    mergedPackageTranslations.get(packageName)?.get(locale) ??
    mergedPackageTranslations
      .get(packageName)
      ?.get(packageDefaultLocale.get(packageName)!);

  if (!translations) throw new Error(`Missing translations for ${packageName}`);

  let current = translations;
  for (const segment of key.split('.')) {
    if (segment in current) {
      current = current[segment];
    } else {
      throw new Error(`Missing translation for ${packageName}:${key}`);
    }
  }

  return current as any as string;
}
