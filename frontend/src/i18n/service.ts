import {
  MessageFormatElement,
  parse,
} from '@formatjs/icu-messageformat-parser';
import * as fs from 'fs';
import * as globby from 'globby';
import * as path from 'path';
import * as yaml from 'yaml';
import { flattenObject } from '../utils';
import { __locales } from '../utils/paths';

export interface BaseTranslationEntry {
  file: string;
  key: string;
}

export interface StringTranslationEntry extends BaseTranslationEntry {
  type: 'string';
  value: string;
  ast: MessageFormatElement[];
}

export interface ArrayTranslationEntry extends BaseTranslationEntry {
  type: 'array';
  value: string[];
  asts: MessageFormatElement[][];
}

export type TranslationEntry = StringTranslationEntry | ArrayTranslationEntry;

export class TranslationService {
  private readonly translations = new Map<
    string,
    Map<string, TranslationEntry>
  >();

  constructor(
    private readonly defaultLocale: string,
    private readonly loader = new TranslationsLoader(),
    private readonly verifier = new TranslationsVerifier(defaultLocale)
  ) {
    this.loadTranslations(this.defaultLocale);
  }

  getOrLoadTranslations(locale: string): Map<string, TranslationEntry> {
    const cachedTranslations = this.translations.get(locale);
    if (cachedTranslations) return cachedTranslations;

    const translations = this.loadTranslations(locale);

    return translations;
  }

  private loadTranslations(locale: string): Map<string, TranslationEntry> {
    const translations = this.loader.loadTranslations(locale);
    if (locale !== this.defaultLocale) {
      this.verifier.verifyTranslations(translations, this.translations);
    }
    this.translations.set(locale, translations);

    return translations;
  }

  translate(locale: string, key: string): string | string[] {
    const translation = this.getOrLoadTranslations(locale).get(key);
    if (translation) {
      return translation.value;
    }

    const defaultTranslation = this.getOrLoadTranslations(
      this.defaultLocale
    ).get(key);
    if (defaultTranslation) {
      return defaultTranslation.value;
    }

    console.warn(`Translation for key ${key} for locale ${locale} not found.`);
    return key;
  }
}

export class TranslationsLoader {
  loadTranslations(locale: string): Map<string, TranslationEntry> {
    const translations = new Map<string, TranslationEntry>();
    const translationFiles = globby.sync('**/*.yml', {
      cwd: path.join(__locales, locale),
    });

    for (const translationFile of translationFiles) {
      this.loadTranslationsFileIntoTranslationsMap(
        translationFile,
        locale,
        translations
      );
    }

    return translations;
  }

  private loadTranslationsFileIntoTranslationsMap(
    translationFile: string,
    locale: string,
    translationsMap: Map<string, TranslationEntry>
  ): void {
    const translationKeyPrefix = translationFile
      .substring(0, translationFile.lastIndexOf('.'))
      .replace(/\//g, '.');

    const translationFilePath = path.join(__locales, locale, translationFile);
    const translationsObject = yaml.parse(
      fs.readFileSync(translationFilePath, 'utf-8')
    );

    const translations = flattenObject(translationsObject, '.');

    for (const key in translations) {
      const translationKey = `${translationKeyPrefix}.${key}`
        .replace(/(^\.|\.$)/g, '')
        .replace(/\.index|index\./g, '');
      // @ts-expect-error -- Object access
      const translationValue = translations[key];

      const baseTranslationEntry: BaseTranslationEntry = {
        file: translationFilePath,
        key: translationKey,
      };

      let translationEntry;
      if (typeof translationValue === 'string') {
        translationEntry = {
          ...baseTranslationEntry,
          type: 'string',
          value: translationValue,
          ast: parse(translationValue),
        } satisfies StringTranslationEntry;
      } else {
        translationEntry = {
          ...baseTranslationEntry,
          type: 'array',
          value: translationValue,
          asts: translationValue.map(parse),
        } satisfies ArrayTranslationEntry;
      }

      translationsMap.set(translationKey, translationEntry);
    }
  }
}

export class TranslationsVerifier {
  constructor(private readonly defaultLocale: string) {}

  verifyTranslations(
    translations: Map<string, TranslationEntry>,
    allTranslations: Map<string, Map<string, TranslationEntry>>
  ): void {
    const defaultTranslations = allTranslations.get(this.defaultLocale);
    if (!defaultTranslations) {
      throw new Error('Default translations not loaded');
    }

    for (const key in translations) {
      const translation = translations.get(key)!;
      const defaultTranslation = defaultTranslations.get(key);

      if (!defaultTranslation) {
        console.warn(
          `Missing default translation for key "${key}" in file "${translation.file}"`
        );
        continue;
      }

      if (translation.type !== defaultTranslation.type) {
        console.warn(
          `Type mismatch for key "${key}" in file "${translation.file}"`
        );
      }
    }
  }
}
