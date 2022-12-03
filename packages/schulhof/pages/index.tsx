import { useT } from '@dsh/core';

export default function Page() {
  const { t } = useT();

  console.dir(__dshI18n, { depth: null });

  console.log(t('paths.schulhof'));

  return t('login.login.subtitle');
}
