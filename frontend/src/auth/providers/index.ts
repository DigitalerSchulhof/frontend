import * as password from './password';

export interface AuthProvider {
  Login: () => JSX.Element;
}

({
  password,
}) satisfies Record<string, AuthProvider>;

export { password };
