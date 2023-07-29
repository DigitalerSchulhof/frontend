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

export async function generatePassword(): Promise<{
  hashedPassword: Buffer;
  rawPassword: string;
  salt: Buffer;
}> {
  const password = generateRawPassword();
  const salt = generateSalt();

  return {
    hashedPassword: await hashPassword(password, salt),
    rawPassword: password,
    salt,
  };
}

export function generateSalt(): Buffer {
  return crypto.randomBytes(128);
}

const wishlist =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$';

// https://stackoverflow.com/a/51540480/12405307
function generateRawPassword(length = 20): string {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');
}

export async function hashPassword(
  password: string,
  salt: Buffer
): Promise<Buffer> {
  return new Promise((res, rej) =>
    crypto.pbkdf2(password, salt, 10000, 512, 'sha512', (err, key) => {
      if (err) {
        rej(err);
      } else {
        res(key);
      }
    })
  );
}

export function doPasswordsMatch(
  hashedPassword: Buffer,
  hashedOtherPassword: Buffer
): boolean {
  return (
    hashedPassword.length === hashedOtherPassword.length &&
    crypto.timingSafeEqual(hashedPassword, hashedOtherPassword)
  );
}

export function signJwt(
  iat: number,
  sessionId: string,
  accountId: string
): Promise<string> {
  return new Promise((res, rej) => {
    jwt.sign(
      { ver: '1', iat, sessionId } satisfies Omit<
        JwtPayload,
        'exp' | 'iss' | 'sub'
      >,
      config.jwtSecret,
      {
        expiresIn: '1d',
        issuer: 'dsh',
        subject: accountId,
      },
      (err, token) => (err ? rej(err) : res(token!))
    );
  });
}

export function verifyJwt(token: string): Promise<JwtPayload | null> {
  return new Promise((res, rej) => {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          return res(null);
        }

        return rej(err);
      }

      return res(decoded as JwtPayload);
    });
  });
}
