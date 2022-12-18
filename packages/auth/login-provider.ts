import { getShell } from '@dsh/core';

export interface LoginProviderProps {
  privacyNote: JSX.Element;
  submitJWT(jwt: string): void;
}

export type LoginProvider = React.FC<LoginProviderProps>;

export function getLoginProviders() {
  return getShell<LoginProvider>('login-provider');
}
