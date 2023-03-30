import { authProviders, isAuthProvider } from '#/auth/providers';

export async function POST(req: Request) {
  const body = await req.json();
  const { provider } = body;

  if (!isAuthProvider(provider)) {
    return new Response('Invalid provider', { status: 400 });
  }

  return authProviders[provider].login.doLogin(req, body);
}
