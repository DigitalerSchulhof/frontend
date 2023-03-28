'use client';

import { ClientTranslations, TranslationsProvider } from '#/i18n/context';
import { SettingsProvider } from '#/settings';
import { AppSettings } from '#/settings/context';
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
