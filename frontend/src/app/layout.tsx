import { ClientTranslations } from '#/i18n/context';
import { TranslationService } from '#/i18n/service';
import { DEFAULT_LOCALE } from '#/utils';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientTranslations = makeClientTranslations(DEFAULT_LOCALE);

  const appSettings = {
    locale: DEFAULT_LOCALE,
  };

  return (
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

function makeClientTranslations(locale: string): ClientTranslations {
  const translationService = new TranslationService(locale);

  const defaultTranslations =
    translationService.getOrLoadTranslations(DEFAULT_LOCALE);
  const translations = translationService.getOrLoadTranslations(locale);

  const clientTranslations: ClientTranslations = {};

  for (const key of defaultTranslations.keys()) {
    const translation = translations.get(key) ?? defaultTranslations.get(key)!;

    clientTranslations[key] = {
      type: translation.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ast: (translation as any).ast,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      asts: (translation as any).asts,
    };
  }

  return clientTranslations;
}
