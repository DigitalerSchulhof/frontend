'use client';
import { useTranslations } from '#/i18n';
import { Note } from '#/ui/Note';

export const PrivacyNote = () => {
  const { t } = useTranslations();

  return (
    <>
      {t('schulhof.login.login.privacy').map((s, i) => (
        <Note key={i}>{s}</Note>
      ))}
    </>
  );
};
