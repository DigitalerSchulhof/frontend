import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import React, { ReactNode } from 'react';
import { useSettings } from '../settings';
import { Translations } from './translations';

declare const translationAstFor: unique symbol;

export type TranslationAST<T, Args = []> = {
  key: string;
  ast: MessageFormatElement[] | MessageFormatElement[][];
  // This is merely set for proper type inference
  [translationAstFor]: [T, Args];
};

type TFunc = {
  <T, Args extends any[]>(ast: TranslationAST<T, Args>, ...args: Args): T;

  <K extends keyof Translations>(
    key: K,
    ...args: Translations[K][0]
  ): Translations[K][1];
};

export function getTranslation<K extends keyof Translations>(
  key: K
): TranslationAST<Translations[K][1], Translations[K][0]> {
  return null as any; // magicc
}

export function useT(): TFunc {
  const settings = useSettings();

  function tFuncImplementation(
    keyAndAST: TranslationAST<any, any>,
    data?: any
  ): any {
    const { key, ast } = keyAndAST;
    // At runtime, this function actually receives the listed set of arguments.
    // The way it is typed ("as TFunc") is merely for proper type checking & completion before we transform it.
    // This function's actual purpose is merely to fill in the ICU message syntax stuff.
    const flattenedData = flattenKeys(data);
    let i = 0;

    if (Array.isArray(ast[0])) {
      return (ast as MessageFormatElement[][]).map((a) => {
        try {
          const r = new IntlMessageFormat(a, settings.locale).format<ReactNode>(
            {
              i: (c) => c.map((e) => <i key={i++}>{e}</i>),
              b: (c) => c.map((e) => <b key={i++}>{e}</b>),
              ...flattenedData,
            }
          ) as any;
          if (typeof r === 'string') return r as any;

          return React.Children.toArray(r) as any;
        } catch (e: any) {
          console.error('Failed to format translation', {
            error: e.message,
            key,
            locale: settings.locale,
            data,
          });
          return key as any;
        }
      });
    } else {
      try {
        const r = new IntlMessageFormat(
          ast as MessageFormatElement[],
          settings.locale
        ).format<ReactNode>({
          i: (c) => c.map((e) => <i key={i++}>{e}</i>),
          b: (c) => c.map((e) => <b key={i++}>{e}</b>),
          ...flattenedData,
        }) as any;
        if (typeof r === 'string') return r as any;

        return React.Children.toArray(r) as any;
      } catch (e: any) {
        console.error('Failed to format translation', {
          error: e.message,
          key,
          locale: settings.locale,
          data,
        });
        return key as any;
      }
    }
  }

  return tFuncImplementation as TFunc;
}

function flattenKeys(obj: any): any {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const val = obj[key];
      if (
        typeof val === 'object' &&
        val !== null &&
        val instanceof Date === false
      ) {
        const flatObject = flattenKeys(val);
        Object.keys(flatObject).forEach((k) => {
          acc[`${key}_${k}`] = flatObject[k];
        });
      } else {
        acc[key] = val;
      }

      return acc;
    }, {});
  }
  return obj;
}
