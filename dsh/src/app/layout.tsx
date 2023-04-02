import { getOrMakeClientTranslations } from '#/i18n/server';
import { getSettings } from '#/settings/server';
import { DEFAULT_LOCALE } from '#/utils';
import { Providers } from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientTranslations = getOrMakeClientTranslations(DEFAULT_LOCALE);

  const appSettings = await getSettings();

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang -- TODO
    <html>
      <body>
        <Providers
          clientTranslations={clientTranslations}
          appSettings={appSettings}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
