import { getJwtFromCookies } from '#/auth/jwt';

export async function requireLogin(req = true): Promise<void> {
  const jwt = getJwtFromCookies();
}
