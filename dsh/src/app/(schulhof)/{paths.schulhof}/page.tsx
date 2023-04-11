import { getCurrentSession } from '#/auth/server';
import { getContext } from '#/backend/context';
import { useT } from '#/i18n';
import { redirect } from 'next/navigation';

export default async function Page() {
  const context = getContext();
  const session = await getCurrentSession(context);
  const { t } = useT();

  if (session) {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.account')}`);
  } else {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
  }
}
