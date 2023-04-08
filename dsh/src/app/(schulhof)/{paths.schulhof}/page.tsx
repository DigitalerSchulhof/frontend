import { getCurrentUser } from '#/auth/server';
import { getServerT } from '#/i18n/server';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();
  const { t } = getServerT();

  if (user) {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.account')}}`);
  } else {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
  }
}
