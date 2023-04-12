import { getCurrentSession } from '#/auth/server';
import { NotLoggedInError } from '#/auth/server/require-login';
import { getContext } from '#/backend/context';
import { useT } from '#/i18n';
import { redirect } from 'next/navigation';

export default async function Page() {
  const context = getContext();
  const { t } = useT();

  try {
    await getCurrentSession(context);
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.account')}`);
  } catch (err) {
    if (err instanceof NotLoggedInError) {
      redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
    }

    throw err;
  }
}
