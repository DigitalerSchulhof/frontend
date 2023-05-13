import {
  SessionBase,
  SessionRepository,
} from '#/backend/repositories/content/session';
import { config } from '#/config';
import * as jwt from 'jsonwebtoken';
import { Service } from '../base';

export type JwtPayload = {
  ver: '1';
  iat: number;
  sessionId: string;
  exp: number;
  iss: 'dsh';
  /**
   * accountId
   */
  sub: string;
};

export class SessionService extends Service<
  'sessions',
  SessionBase,
  SessionRepository
> {
  async createJwt(accountId: string): Promise<string> {
    const now = new Date();
    const iat = Math.floor(now.getTime() / 1000);

    const session = await this.repository.create({
      accountId,
      iat,
      didShowLastLogin: false,
    });

    return this.signJwt(iat, session.id, accountId);
  }

  signJwt(iat: number, sessionId: string, accountId: string): string {
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

  verifyJwt(token: string): JwtPayload | null {
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
}
