import { getShell } from '@dsh/core/shell';

export interface LoginProviderProps {
  privacyNote: JSX.Element;
}

export type LoginProvider = React.FC<LoginProviderProps>;

export function getLoginProviders() {
  return getShell<LoginProvider>('login-provider');
}
