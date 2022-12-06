import { useAuth } from '@dsh/auth';
import { useT } from '@dsh/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useRequireLogin } from '../..';

const Page: NextPage = () => {
  const router = useRouter();
  const { t } = useT();
  const { isLoggedIn } = useAuth();
  useRequireLogin(false);
  if (!isLoggedIn) router.replace(`/${t('paths.index')}/${t('paths.login')}`);

  return <>yO</>;
};

export default Page;
