import { config } from '#/config';
import { getServerT } from '#/i18n/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireLogin(req = true): Promise<void> {
  const { t } = getServerT();

  const isValid = (await getCurrentUser()) !== null;

  if (isValid === req) return;

  if (req) {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
  } else {
    redirect(`/${t('paths.schulhof')}/${t('paths.schulhof.account')}}`);
  }
}

export async function getCurrentUser(): Promise<{
  id: string;
} | null> {
  const token = cookies().get('jwt')?.value;

  if (!token) return null;

  try {
    const content = jwt.verify(token, config.jwtSecret);

    if (typeof content === 'string') return null;

    if (!('id' in content)) return null;

    // TODO: Verify id is valid

    return {
      id: content.id,
    };
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return null;
    }

    throw err;
  }
}
