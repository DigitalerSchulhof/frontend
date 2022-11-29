import { getShell } from '@dsh/shell';

export interface LoginProvider {
  component: JSX.Element;
  onLogin(): void;
}

export function getLoginProviders() {
  return getShell<LoginProvider>('login-provider');
}
