import * as jwt from 'jsonwebtoken';
import { BackendContext } from '../../types';

export async function createJwt(
  ctx: BackendContext,
  user: {
    _key: string;
  }
) {
  return jwt.sign({}, ctx.jwt.privateKey, {
    subject: user._key,
  });
}
