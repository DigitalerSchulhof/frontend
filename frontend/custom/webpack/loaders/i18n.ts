import * as yaml from 'yaml';
import * as fs from 'fs';
import * as path from 'path';
import { LoaderDefinitionFunction } from 'webpack';
import {
  findNearestPackageJson,
  mergeObjects,
  pickFromObject,
  readJsonSync,
  yieldFiles,
  yieldModules,
} from '../../utils';

const locale = 'en-GB';

const T_FUNC_REGEX = /\bt\(["']([a-z-.]+)["']\)/g;

/**
 * @key package name
 * @value {
 *   @key locale code
 *   @value translations tree
 * }
 */
const packageLocales = new Map<string, Map<string, Record<string, any>>>();
/**
 * @key package name
 * @value {
 *   @key locale code
 *   @value translations tree
 * }
 */
const mergedPackageLocales = new Map<
  string,
  Map<string, Record<string, any>>
>();
/**
 * @key package name
 * @value default locale
 */
const packageDefaultLocales = new Map<string, string>();

for (const dir of yieldModules()) {
  if (!fs.existsSync(path.join(dir, 'locales'))) continue;

  const pkg = readJsonSync(`${dir}/package.json`);
  if ('defaultLocale' in pkg.dsh === false) {
    throw new Error(`Missing defaultLocale in ${pkg.name}`);
  }

  packageDefaultLocales.set(pkg.name, pkg.defaultLocale);

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

  packageLocales.set(pkg.name, locales);

  const mergedLocales = new Map<string, Record<string, any>>();
  for (const locale of fs.readdirSync(path.join(dir, 'locales'))) {
    const l = locales.get(locale)!;
    const dl = locales.get(pkg.dsh.defaultLocale)!;

    mergedLocales.set(locale, mergeObjects(dl, l, false));
  }
  mergedPackageLocales.set(pkg.name, mergedLocales);
}

export const i18nLoader: LoaderDefinitionFunction = async function (source) {
  const matches = source.matchAll(T_FUNC_REGEX);

  if (!matches) return source;

  const packageName = readJsonSync<{ name: string }>(
    findNearestPackageJson(this.resourcePath)
  ).name;

  /**
   * @key package name
   * @value found keys
   */
  const foundKeys = new Map<string, Set<string>>();

  let offset = 0;

  for (const match of matches) {
    const [stringMatch, i18nKey] = match;

    let key = i18nKey;
    let keyPackageName = packageName;

    if (i18nKey.includes(':')) {
      [keyPackageName, key] = i18nKey.split(':');
    }

    const keyPath = [keyPackageName, ...key.split('.')];

    if (!foundKeys.has(keyPackageName)) {
      foundKeys.set(keyPackageName, new Set());
    }

    foundKeys.get(keyPackageName)!.add(key);

    source =
      source.substring(0, offset + match.index!) +
      `t(__dshI18n${keyPath.map((p) => `['${p}']`).join('')})` +
      source.substring(offset + match.index! + stringMatch.length);

    offset +=
      `t(__dshI18n${keyPath.map((p) => `['${p}']`).join('')})`.length -
      stringMatch.length;
  }

  /**
   * @key package name
   * @values translations tree
   */
  const allTranslations: Record<string, any> = {};
  for (const [keyPackageName, keys] of foundKeys) {
    allTranslations[keyPackageName] = getTranslationsTree(
      keyPackageName,
      Array.from(keys),
      locale
    );
  }

  return (
    `const __dshI18n = ${JSON.stringify(allTranslations)};
` + source
  );
};

export default i18nLoader;

function getTranslationsTree(
  packageName: string,
  keys: string[],
  locale: string
): Record<string, any> {
  let localeTranslations = mergedPackageLocales.get(packageName)?.get(locale);
  if (!localeTranslations) {
    localeTranslations = packageLocales.get(
      packageDefaultLocales.get(packageName)!
    )!;
  }

  /**
   * A tree with `true` leaves of keys to include
   */
  const keysObject: Record<string, any> = {};
  for (const key of keys) {
    const split = key.split('.');
    let current = keysObject;
    for (let i = 0; i < split.length - 1; i++) {
      current[split[i]] ??= {};
      current = current[split[i]];
    }
    current[split[split.length - 1]] = true;
  }

  return pickFromObject(localeTranslations, keysObject, true);
}
