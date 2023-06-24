import { config } from '#/config';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  ver: '1';
  /**
   * Issued at in s
   */
  iat: number;
  sessionId: string;
  /**
   * Expiration date in s
   */
  exp: number;
  iss: 'dsh';
  /**
   * accountId
   */
  sub: string;
};

export function generatePassword(): { password: string; salt: string } {
  const password = generateRawPassword();
  const salt = generateSalt();

  return { password: hashPassword(password, salt), salt };
}

export function generateSalt(): string {
  return crypto.randomBytes(128).toString('base64');
}

const wishlist =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';

function generateRawPassword(length = 20): string {
  // https://stackoverflow.com/a/51540480/12405307

  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');
}

export function hashPassword(password: string, salt: string): string {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('base64');
}

export function doPasswordsMatch(
  hashedPassword: string,
  hashedOtherPassword: string
): boolean {
  return (
    hashedPassword.length === hashedOtherPassword.length &&
    crypto.timingSafeEqual(
      Buffer.from(hashedPassword, 'base64'),
      Buffer.from(hashedOtherPassword, 'base64')
    )
  );
}

export function signJwt(
  iat: number,
  sessionId: string,
  accountId: string
): string {
  return jwt.sign(
    { ver: '1', iat, sessionId } satisfies Omit<
      JwtPayload,
      'exp' | 'iss' | 'sub'
    >,
    config.jwtSecret,
    {
      expiresIn: '1d',
      issuer: 'dsh',
      subject: accountId,
    }
  );
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    // Only valid tokens can have our signature.
    return jwt.verify(token, config.jwtSecret) as JwtPayload;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return null;
    }

    throw err;
  }
}
