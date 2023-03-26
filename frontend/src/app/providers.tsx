'use client';

import { ClientTranslations, TranslationsProvider } from '#/i18n/provider';
import { StyleProvider } from './style-provider';

export const Providers = ({
  children,
  clientTranslations,
}: {
  children: React.ReactNode;
  clientTranslations: ClientTranslations;
}) => {
  return (
    <StyleProvider>
      <TranslationsProvider translations={clientTranslations}>
        {children}
      </TranslationsProvider>
    </StyleProvider>
  );
};
