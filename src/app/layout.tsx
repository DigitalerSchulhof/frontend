import { getContext } from '#/auth/component';
import React from 'react';
import { Providers } from './providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clientTranslations } = getContext();

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang -- TODO
    <html>
      <body>
        <Providers clientTranslations={clientTranslations}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
