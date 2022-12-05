import * as React from 'react';
import type { LoginProvider } from '@dsh/schulhof/shells/login-provider';
import { useT } from '@dsh/core';

const passwordLoginProvider: LoginProvider = {
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useT();

    return <div>{t('@dsh/schulhof:login.login.title')}</div>;
  },
  onLogin() {
    alert('HI');
  },
};

export default passwordLoginProvider;
