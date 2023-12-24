import { componentContextCreator } from '#/auth/component';
import { redirect } from 'next/navigation';

export default async function Page() {
  const { t } = componentContextCreator.getContext();
  const session = await componentContextCreator.getSessionData();

  if (session) {
    redirect(
      `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
    );
  }

  redirect(`/${[t('paths.schulhof'), t('paths.schulhof.login')].join('/')}`);
}
