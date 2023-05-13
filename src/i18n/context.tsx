'use client';

import { ClientTranslations } from '#/context/contexts/i18n/client-translations';
import { createContext } from 'react';

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
