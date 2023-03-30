'use client';

import { settingsContext } from '#/settings/context';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import React, { ReactNode, useContext } from 'react';
import { ClientTranslations, translationsContext } from './context';
import { Translations } from './translations';

type T = {
  t<K extends keyof Translations>(
    this: void,
    key: K,
    ...[args]: Translations[K]['variables']
  ): Translations[K]['type'];
  tIfCurly<K extends string>(
    this: void,
    key: K,
    args?: unknown
  ): Translations[keyof Translations]['type'];
};

export const useTranslations = (): T => {
  const translations = useContext(translationsContext);
  const settings = useContext(settingsContext);

  function transformAst(
    ast: MessageFormatElement[],
    key: string,
    args: unknown
  ): string | React.ReactNode {
    let i = 0;

    let res;
    try {
      res = new IntlMessageFormat(ast, settings.locale).format<ReactNode>({
        i: (c) => c.map((e) => <i key={i++}>{e}</i>),
        b: (c) => c.map((e) => <b key={i++}>{e}</b>),
        ...(args as object | undefined),
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

  function t(this: void, key: string, args: unknown) {
    const translation = translations[key] as
      | ClientTranslations[keyof ClientTranslations]
      | undefined;

    if (!translation) {
      return key;
    }

    if (translation.type === 'string') {
      return transformAst(translation.ast, key, args);
    } else {
      return translation.asts.map((ast) => transformAst(ast, key, args));
    }
  }

  return {
    t,
    tIfCurly: (key: string, args: unknown) => {
      if (key.startsWith('{') && key.endsWith('}')) {
        return t(key.slice(1, -1), args);
      }
      return key;
    },
  } as T;
};
