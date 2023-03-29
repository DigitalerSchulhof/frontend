import { authProviders, isAuthProvider } from '#/auth/providers';

export async function POST(req: Request) {
  const { provider } = await req.json();

  if (!isAuthProvider(provider)) {
    return new Response('Invalid provider', { status: 400 });
  }

  return authProviders[provider].login.doLogin(req);
}
