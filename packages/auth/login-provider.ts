import { getShell } from '@dsh/core';

export interface LoginProviderProps {
  privacyNote: JSX.Element;
  submitJwt(jwt: string): void;
}

export type LoginProvider = React.FC<LoginProviderProps>;

export function getLoginProviders() {
  return getShell<LoginProvider>('login-provider');
}
