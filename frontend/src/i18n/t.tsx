'use client';

import { settingsContext } from '#/settings/context';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import React, { ReactNode, useContext } from 'react';
import { ClientTranslations, translationsContext } from './context';
import { Translations } from './translations';

type T = {
  t<K extends keyof Translations>(this: void, key: K): Translations[K]['type'];
  tIfCurly<K extends keyof Translations>(
    this: void,
    key: K
  ): Translations[K]['type'];
};

export const useTranslations = (): T => {
  const translations = useContext(translationsContext);
  const settings = useContext(settingsContext);

  function transformAst(
    ast: MessageFormatElement[],
    key: string
  ): string | React.ReactNode {
    let i = 0;

    let res;
    try {
      res = new IntlMessageFormat(ast, settings.locale).format<ReactNode>({
        i: (c) => c.map((e) => <i key={i++}>{e}</i>),
        b: (c) => c.map((e) => <b key={i++}>{e}</b>),
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error('Failed to format translation', {
          error: e.message,
          key,
          locale: settings.locale,
        });

        return key;
      }

      throw e;
    }

    if (typeof res === 'string') return res;

    return React.Children.toArray(res);
  }

  function t(this: void, key: string) {
    const translation = translations[key] as
      | ClientTranslations[keyof ClientTranslations]
      | undefined;

    if (!translation) {
      return key;
    }

    if (translation.type === 'string') {
      return transformAst(translation.ast, key);
    } else {
      return React.Children.toArray(
        translation.asts.map((ast) => transformAst(ast, key))
      );
    }
  }

  return {
    t,
    tIfCurly: (key: string) => {
      if (key.startsWith('{') && key.endsWith('}')) {
        return t(key.slice(1, -1));
      }
      return key;
    },
  } as T;
};
