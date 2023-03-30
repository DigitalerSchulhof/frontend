import { BackendContext } from '#/backend/context';
import { SessionBase } from '#/backend/repositories/content/session';
import * as jwt from 'jsonwebtoken';
import { Service } from '../base';

export class SessionService extends Service<'sessions', SessionBase> {
  async createJwt(context: BackendContext, personId: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);

    const session = await this.repository.create({
      personId,
      iat,
    });

    return jwt.sign(
      {
        iat,
        id: session.id,
        personId: session.personId,
      },
      context.config.jwtSecret,
      {
        expiresIn: '1d',
      }
    );
  }
}
