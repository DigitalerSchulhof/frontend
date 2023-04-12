'use client';

import { ClientTranslations, TranslationsProvider } from '#/i18n/client';
import { SettingsProvider } from '#/settings/client';
import { AppSettings } from '#/settings/client/context';
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
