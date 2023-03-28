'use client';

import { T } from '#/i18n';
import { useSettings } from '#/settings/context';

export const SchulhofLoginHeader = () => {
  const settings = useSettings();

  return (
    <T
      t='schulhof.login.welcome'
      args={{
        school_name_genus: settings.school.name.genus,
        school_name_genitive: settings.school.name.genitive,
      }}
    />
  );
};
