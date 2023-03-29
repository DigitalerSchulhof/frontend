import * as password from './password';

export interface AuthProvider {
  login: {
    LoginForm: () => JSX.Element;
    doLogin: (req: Request) => Response;
  };
}

export const authProviders = {
  password,
} satisfies Record<string, AuthProvider>;

export function isAuthProvider(
  val: unknown
): val is keyof typeof authProviders {
  return typeof val === 'string' && val in authProviders;
}
