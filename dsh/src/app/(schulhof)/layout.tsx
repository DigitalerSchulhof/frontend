import { Body } from '#/body';
import { Footer } from '#/footer';
import { Header } from '#/header';

export default function SchulhofLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Body>{children}</Body>
      <Footer />
    </>
  );
}
