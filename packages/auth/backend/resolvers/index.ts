import { BackendContext } from '@dsh/backend/resolvers/context';
import jwt from 'jsonwebtoken';

export async function createJwt(
  ctx: BackendContext,
  user: {
    _key: string;
  }
) {
  return jwt.sign(
    {
      sub: user._key,
      iat: Math.floor(Date.now() / 1000),
    },
    ctx.jwt.privateKey
  );
}
