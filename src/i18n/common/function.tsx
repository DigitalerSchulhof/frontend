import { ClientTranslations } from '#/i18n/client';
import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import IntlMessageFormat from 'intl-messageformat';
import React from 'react';
import { Translations } from '../translations';

export type TFunction = <K extends keyof Translations>(
  this: void,
  key: K,
  ...[args]: Translations[K]['variables']
) => Translations[K]['type'];

export function makeTFunction(
  translations: ClientTranslations,
  locale: string
): TFunction {
  return function tFunction(key, args?) {
    if (key.startsWith('{') && key.endsWith('}')) return key.slice(1, -1);

    const translation = translations[key] as
      | ClientTranslations[keyof ClientTranslations]
      | undefined;

    if (!translation) return key;

    if (translation.type === 'string') {
      return transformTranslationAst(translation.ast, key, args, locale);
    } else {
      return translation.asts.map((ast) =>
        transformTranslationAst(ast, key, args, locale)
      );
    }
  };
}

function transformTranslationAst(
  ast: MessageFormatElement[],
  key: string,
  args: object | undefined,
  locale: string
): string | React.ReactNode {
  let res;
  try {
    res = new IntlMessageFormat(ast, locale).format<React.ReactNode>({
      // eslint-disable-next-line react/jsx-key
      i: (c) => c.map((e) => <i>{e}</i>),
      // eslint-disable-next-line react/jsx-key
      b: (c) => c.map((e) => <b>{e}</b>),
      // eslint-disable-next-line react/jsx-key
      u: (c) => c.map((e) => <u>{e}</u>),
      ...args,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error('Failed to format translation', {
        error: e.message,
        key,
        locale,
      });

      return key;
    }

    throw e;
  }

  if (typeof res === 'string') return res;

  return React.Children.toArray(res);
}
