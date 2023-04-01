import * as jwt from 'jsonwebtoken';
import { getJwtFromCookies } from '#/auth/jwt';
import { config } from '#/config';
import { redirect } from 'next/navigation';

declare const t: any;

export async function requireLogin(req = true): Promise<void> {
  const token = getJwtFromCookies();
  const isValid = await isValidJwt(token);

  if (isValid === req) return;

  if (req) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    redirect(`${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
  } else {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    redirect(`${t('paths.schulhof')}/${t('paths.schulhof.account')}`);
  }
}

async function isValidJwt(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const content = jwt.verify(token, config.jwtSecret);

    if (typeof content === 'string') return false;

    if (!('id' in content)) return false;

    return true;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return false;
    }

    throw err;
  }
}
