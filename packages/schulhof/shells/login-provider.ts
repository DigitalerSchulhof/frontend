import { getShell } from '@dsh/core';

export interface LoginProvider {
  component: JSX.Element;
  onLogin(): void;
}

export function getLoginProviders() {
  return getShell<LoginProvider>('login-provider');
}
