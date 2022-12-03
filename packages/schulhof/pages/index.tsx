import { useT } from '@dsh/core';

export default function Page() {
  const { t } = useT();

  console.log(t('paths.schulhof'));

  return t('login.login.subtitle');
}
