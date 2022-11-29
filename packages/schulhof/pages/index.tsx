import * as React from 'react';
import { getLoginProviders } from '~/shells/login-provider';

export default function Page() {
  const loginProviders = getLoginProviders();

  console.log(loginProviders);

  return (
    <>
      {loginProviders[0].component}
      <button onClick={loginProviders[0].onLogin}>Login</button>
    </>
  );
}
