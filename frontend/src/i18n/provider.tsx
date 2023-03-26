'use client';

import { MessageFormatElement } from '@formatjs/icu-messageformat-parser';
import { createContext } from 'react';

export type ClientTranslations = Record<
  string,
  | {
      type: 'string';
      ast: MessageFormatElement[];
    }
  | {
      type: 'array';
      asts: MessageFormatElement[][];
    }
>;

export const translationsContext = createContext<ClientTranslations>({});

export const TranslationsProvider = ({
  children,
  translations,
}: {
  children: React.ReactNode;
  translations: ClientTranslations;
}) => {
  return (
    <translationsContext.Provider value={translations}>
      {children}
    </translationsContext.Provider>
  );
};
