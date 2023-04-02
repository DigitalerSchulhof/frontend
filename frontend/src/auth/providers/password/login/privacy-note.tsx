'use client';
import { useT } from '#/i18n';
import { Link } from '#/ui/Link';
import { Note } from '#/ui/Note';

export const PrivacyNote = () => {
  const { t } = useT();

  return (
    <>
      {t('schulhof.login.login.privacy', {
        PrivacyLink: (c) =>
          // eslint-disable-next-line react/jsx-key
          c.map((e) => <Link href={['paths.privacy']}>{e}</Link>),
      }).map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
    </>
  );
};
