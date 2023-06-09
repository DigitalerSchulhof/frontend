import { getContext } from '#/auth/component';
import { getSettings } from '#/settings/server';
import React from 'react';
import { Providers } from './providers';

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires -- Don't want this in prod
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}

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
