import { flattenObject } from '#/utils';
import { __locales } from '#/utils/paths';
import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { TYPE, parse } from '@formatjs/icu-messageformat-parser';
import * as fs from 'fs';
import * as globby from 'globby';
import * as path from 'path';
import * as yaml from 'yaml';

export type BaseTranslationEntry = {
  key: string;
  /**
   * Path relative to the locales directory.
   */
  file: string;
};

export type StringTranslationEntry = BaseTranslationEntry & {
  type: 'string';
  ast: MessageFormatElement[];
};

export type ArrayTranslationEntry = BaseTranslationEntry & {
  type: 'array';
  asts: MessageFormatElement[][];
};

export type TranslationEntry = StringTranslationEntry | ArrayTranslationEntry;

export function loadTranslations(
  locale: string
): Map<string, TranslationEntry> {
  const translations = new Map<string, TranslationEntry>();
  /**
   * Path relative to the locales directory.
   */
  const translationFilePaths = globby.sync('**/*.yml', {
    cwd: path.join(__locales, locale),
  });

  for (const translationFilePath of translationFilePaths) {
    const fileTranslations = loadTranslationsFile(locale, translationFilePath);

    for (const [key, value] of fileTranslations) {
      translations.set(key, value);
    }
  }

  return translations;
}

function loadTranslationsFile(
  locale: string,
  /**
   * Path relative to the locale directory.
   */
  translationFilePath: string
): Map<string, TranslationEntry> {
  const translationsKeyPrefix = translationFilePath
    .replace(/\.yml$/, '')
    .replace(/\//g, '.');

  const content = yaml.parse(
    fs.readFileSync(path.join(__locales, locale, translationFilePath), 'utf8')
  );
  const flattenedContent = flattenObject(content, '.');

  return new Map(
    Object.entries(flattenedContent).map(([key, value]) => {
      const translationKey = [
        ...translationsKeyPrefix.split('.'),
        ...key.split('.'),
      ]
        .filter((x) => x !== '' && x !== 'index')
        .join('.');

      const baseTranslationEntry: BaseTranslationEntry = {
        key: translationKey,
        file: translationFilePath,
      };

      let translationEntry: TranslationEntry;
      if (typeof value === 'string') {
        translationEntry = {
          ...baseTranslationEntry,
          type: 'string',
          ast: parse(value),
        } satisfies StringTranslationEntry;
      } else {
        translationEntry = {
          ...baseTranslationEntry,
          type: 'array',
          asts: value.map(parse),
        } satisfies ArrayTranslationEntry;
      }

      return [translationKey, translationEntry];
    })
  );
}

export function expandTranslations(
  translations: ReadonlyMap<string, TranslationEntry>
): Map<string, TranslationEntry> {
  const expandedTranslations = new Map<string, TranslationEntry>();

  for (const [key, translation] of translations) {
    expandedTranslations.set(
      key,
      expandTranslation(key, translation, translations)
    );
  }

  return expandedTranslations;
}

const expandedTranslationsCache = new WeakMap<
  TranslationEntry,
  TranslationEntry
>();

function expandTranslation(
  key: string,
  translation: TranslationEntry,
  translations: ReadonlyMap<string, TranslationEntry>
): TranslationEntry {
  const cachedExpandedTranslation = expandedTranslationsCache.get(translation);
  if (cachedExpandedTranslation) {
    return cachedExpandedTranslation;
  }

  const expandedBase: BaseTranslationEntry = {
    key,
    file: translation.file,
  };

  let expandedTranslation: TranslationEntry;
  if (translation.type === 'string') {
    expandedTranslation = {
      ...expandedBase,
      type: 'string',
      ast: expandAst(key, translation.ast, translations),
    } satisfies StringTranslationEntry;
  } else {
    expandedTranslation = {
      ...expandedBase,
      type: 'array',
      asts: translation.asts.map((ast) => expandAst(key, ast, translations)),
    } satisfies ArrayTranslationEntry;
  }

  expandedTranslationsCache.set(translation, expandedTranslation);
  return expandedTranslation;
}

function expandAst(
  key: string,
  ast: readonly MessageFormatElement[],
  translations: ReadonlyMap<string, TranslationEntry>,
  visitedKeys: Set<string> = new Set<string>()
): MessageFormatElement[] {
  if (visitedKeys.has(key)) {
    throw new Error(
      `Circular dependency detected for translation "${key}". Stack: ${[
        ...visitedKeys,
        key,
      ].join(' -> ')}`
    );
  }

  visitedKeys.add(key);

  const newAst: MessageFormatElement[] = [];

  for (const astElement of ast) {
    if (astElement.type !== TYPE.template) {
      newAst.push(astElement);
      continue;
    }

    const referencedTranslationKey = astElement.value;
    const referencedTranslation = translations.get(referencedTranslationKey);

    if (!referencedTranslation) {
      // Should never happen with verified translations
      throw new Error(
        `Translation for key ${key} references translation for unknown key ${referencedTranslationKey}.`
      );
    }

    if (referencedTranslation.type === 'array') {
      throw new Error(
        `Translation for key ${key} references translation for array key ${referencedTranslationKey}.`
      );
    }

    const expandedReferencedAst = expandAst(
      referencedTranslationKey,
      referencedTranslation.ast,
      translations,
      visitedKeys
    );

    newAst.push(...expandedReferencedAst);
  }

  visitedKeys.delete(key);

  return newAst;
}
