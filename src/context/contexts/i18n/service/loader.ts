import { flattenObject } from '#/utils';
import { __locales } from '#/utils/paths';
import {
  MessageFormatElement,
  TYPE,
  TemplateElement,
  parse,
} from '@formatjs/icu-messageformat-parser';
import * as fs from 'fs';
import * as globby from 'globby';
import * as path from 'path';
import * as yaml from 'yaml';

export type BaseTranslationEntry = {
  file: string;
  key: string;
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

export type ExpandedTranslationEntry = {
  key: string;
  files: string[];
  ast: MessageFormatElement[];
  type: 'string' | 'array';
};

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
        file: translationFilePath,
        key: translationKey,
      };

      let translationEntry;
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
): Map<string, ExpandedTranslationEntry> {
  const expandedTranslations = new Map<string, ExpandedTranslationEntry>();

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
  ExpandedTranslationEntry
>();

function expandTranslation(
  key: string,
  translation: TranslationEntry,
  translations: ReadonlyMap<string, TranslationEntry>,
  visitedKeys = new Set<string>()
): ExpandedTranslationEntry {
  const cachedExpandedTranslation = expandedTranslationsCache.get(translation);
  if (cachedExpandedTranslation) {
    return cachedExpandedTranslation;
  }

  const ast = flattenAst(translation);

  const files = [translation.file];

  if (visitedKeys.has(key)) {
    throw new Error(
      `Circular dependency detected for translation "${key}". Stack: ${[
        ...visitedKeys,
        key,
      ].join(' -> ')}`
    );
  }

  visitedKeys.add(key);

  for (let i = 0; i < ast.length; i++) {
    const astElement = ast[i];

    if (astElement.type !== TYPE.template) {
      continue;
    }

    const referencedTranslationKey = astElement.value;
    const referencedTranslation = translations.get(referencedTranslationKey);

    if (!referencedTranslation) {
      // Should never happen with verified translations
      throw new Error(
        `Translation for key ${translation.key} references translation for unknown key ${referencedTranslationKey}.`
      );
    }

    const expandedReferencedTranslation = expandTranslation(
      referencedTranslationKey,
      referencedTranslation,
      translations,
      visitedKeys
    );
    files.push(...expandedReferencedTranslation.files);

    ast.splice(i, 1, ...expandedReferencedTranslation.ast);
  }

  visitedKeys.delete(key);

  const expandedTranslation = {
    key,
    files,
    ast,
    type: translation.type,
  };

  expandedTranslationsCache.set(translation, expandedTranslation);
  return expandedTranslation;
}

export function flattenAst(
  translation: TranslationEntry
): MessageFormatElement[] {
  const ast =
    translation.type === 'string' ? translation.ast : translation.asts.flat();

  for (const astElement of ast) {
    switch (astElement.type) {
      case TYPE.plural:
      case TYPE.select:
        for (const option of Object.values(astElement.options)) {
          ast.push(...option.value);
        }
        break;
      case TYPE.tag:
        ast.push(...astElement.children);
        break;
      case TYPE.pound:
      case TYPE.number:
      case TYPE.date:
      case TYPE.time:
      case TYPE.argument:
      case TYPE.literal:
      case TYPE.template:
        break;
      default:
        throw new Error(
          // @ts-expect-error -- Invariant
          'Invariant: Unhandled astElement.type: ' + astElement.type
        );
    }
  }

  return ast;
}
