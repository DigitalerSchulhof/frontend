import { useAuth } from '@dsh/auth';
import { useT } from '@dsh/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useRequireLogin = (shouldBeLoggedIn: boolean) => {
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
