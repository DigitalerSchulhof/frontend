import { cookies } from 'next/headers';

export function getJwtFromCookies(): string | undefined {
  const cookieStore = cookies();

  return cookieStore.get('jwt')?.value;
}
