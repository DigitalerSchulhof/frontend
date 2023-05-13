import { NoScript } from '#/app/noscript';
import { Body } from '#/components/body';
import { Footer } from '#/components/footer';
import { Header } from '#/components/header';

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
