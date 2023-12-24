'use client';

import type { ClientTranslations } from '#/context/contexts/i18n/client-translations';
import { TranslationsProvider } from '#/i18n/context';
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
