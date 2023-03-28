'use client';
import { useTranslations } from '#/i18n';
import { Link } from '#/ui/Link';
import { Note } from '#/ui/Note';

export const PrivacyNote = () => {
  const { t } = useTranslations();

  return (
    <>
      {t('schulhof.login.login.privacy', {
        PrivacyLink: (c) =>
          // eslint-disable-next-line react/jsx-key
          c.map((e) => <Link href={[t('paths.privacy')]}>{e}</Link>),
      }).map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
    </>
  );
};
