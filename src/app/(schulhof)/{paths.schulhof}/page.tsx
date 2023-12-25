import { componentContextCreator, getContext } from '#/auth/component';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { t } = getContext();
  const sessionData = await componentContextCreator.getSessionData();

  if (sessionData) {
    redirect(
      `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
    );
  }

  redirect(`/${[t('paths.schulhof'), t('paths.schulhof.login')].join('/')}`);
}
