import {
  SessionBase,
  SessionRepository,
} from '#/backend/repositories/content/session';
import { config } from '#/config';
import * as jwt from 'jsonwebtoken';
import { Service } from '../base';

export type JwtPayload = {
  iat: number;
  sessionId: string;
  accountId: string;
  hasSeenLastLogin: boolean;
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

    return this.signJwt({
      iat,
      sessionId: session.id,
      accountId,
      hasSeenLastLogin: false,
    });
  }

  signJwt({ accountId, ...payload }: JwtPayload): string {
    return jwt.sign({ accountId, ...payload, version: '1' }, config.jwtSecret, {
      expiresIn: '1d',
      issuer: 'dsh',
      subject: accountId,
    });
  }

  verifyJwt(token: string):
    | (JwtPayload & {
        version: '1';
        iat: number;
        exp: number;
        iss: 'dsh';
      })
    | null {
    try {
      // Only valid tokens can have our signature.
      return jwt.verify(token, config.jwtSecret) as JwtPayload & {
        version: '1';
        iat: number;
        exp: number;
        iss: 'dsh';
      };
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return null;
      }

      throw err;
    }
  }
}
