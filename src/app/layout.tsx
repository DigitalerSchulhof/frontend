import { getContext } from '#/auth/component';
import { getSettings } from '#/settings/server';
import { Providers } from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clientTranslations } = getContext();
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
