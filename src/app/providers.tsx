'use client';

import type { ClientTranslations } from '#/context/contexts/i18n/client-translations';
import { TranslationsProvider } from '#/i18n/context';
import { SettingsProvider } from '#/settings/client';
import type { AppSettings } from '#/settings/client/context';
import { StyleProvider } from './style-provider';

export const Providers = ({
  children,
  clientTranslations,
  appSettings,
}: {
  children: React.ReactNode;
  clientTranslations: ClientTranslations;
  appSettings: AppSettings;
}) => {
  return (
    <StyleProvider>
      <TranslationsProvider translations={clientTranslations}>
        <SettingsProvider settings={appSettings}>{children}</SettingsProvider>
      </TranslationsProvider>
    </StyleProvider>
  );
};
