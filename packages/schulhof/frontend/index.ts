import { useAuth } from '@dsh/auth/frontend';
import { useT } from '@dsh/core/frontend';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useRequireLogin = (shouldBeLoggedIn: boolean = true) => {
  const { isLoggedIn } = useAuth();
  const { t } = useT();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn !== shouldBeLoggedIn) {
      if (shouldBeLoggedIn) {
        router.push(`/${t('paths.index')}/${t('paths.login')}`);
      } else {
        router.push(`/${t('paths.index')}`);
      }
    }
  }, [shouldBeLoggedIn, isLoggedIn]);
};
