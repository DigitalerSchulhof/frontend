import { Config } from '../config';
import { createDbContext, DbContext } from './db';
import { createJwtContext, JwtContext } from './jwt';

export interface CreateContextContext {
  config: Config;
}

export type BackendContext = JwtContext & DbContext;

export function createContext(context: CreateContextContext): BackendContext {
  return {
    ...createDbContext(context),
    ...createJwtContext(context),
  };
}
