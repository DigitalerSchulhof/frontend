import { CreateContextContext } from '.';

export interface JwtContext {
  jwt: {
    privateKey: string
  };
}

export function createJwtContext(context: CreateContextContext): JwtContext {
  return {
    jwt: {
      privateKey: context.config.jwt.privateKey,
    }
  };
}
