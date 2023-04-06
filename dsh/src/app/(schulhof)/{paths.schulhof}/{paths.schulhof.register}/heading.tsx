'use client';

import { T } from '#/i18n';
import { useSettings } from '#/settings/client';

export const SchulhofRegisterHeading = () => {
  const settings = useSettings();

  return (
    <T
      t='schulhof.register.heading'
      args={{
        school_name_genus: settings.school.name.genus,
        school_name_genitive: settings.school.name.genitive,
      }}
    />
  );
};
