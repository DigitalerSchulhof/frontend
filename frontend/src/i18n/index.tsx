import type { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import React, { ReactNode } from 'react';
import { useSettings } from '../settings';
import { Translations } from './translations';

type TFunc = <K extends keyof Translations>(
  key: K,
  ...args: Translations[K][0]
) => Translations[K][1];

export function useT(): TFunc {
  const settings = useSettings();

  return ((key: string, ast: MessageFormatElement[], data?: any): any => {
    // At runtime, this function actually receives the listed set of arguments.
    // The way it is typed ("as TFunc") is merely for proper type checking & completion before we transform it.
    // This function's actual purpose is merely to fill in the ICU message syntax stuff.
    const flattenedData = flattenKeys(data);

    try {
      // Array return values are already converted to an array of t-calls, so we technically _always_ return strings
      // even though our function signature says otherwise.
      const r = new IntlMessageFormat(ast, settings.locale).format<ReactNode>({
        i: (c) => c.map((e, i) => <i key={i}>{e}</i>),
        b: (c) => c.map((e, i) => <b key={i}>{e}</b>),
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
  }) as TFunc;
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
