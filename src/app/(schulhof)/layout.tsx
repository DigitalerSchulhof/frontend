import { NoScript } from '#/app/noscript';
import { Body } from '#/shell/body';
import { Footer } from '#/shell/footer';
import { Header } from '#/shell/header';

export default function SchulhofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Body>
        <NoScript />
        {children}
      </Body>
      <Footer />
    </>
  );
}

// Because the entire Schulhof depends on dynamic data (and requires login), it must be dynamic
export const dynamic = 'force-dynamic';
