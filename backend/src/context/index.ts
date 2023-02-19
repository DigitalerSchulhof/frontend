import { Database } from 'arangojs';
import { Config } from '../config';
import { createDbContext, DbContext } from './db';
import { createJwtContext, JwtContext } from './jwt';

export interface CreateContextContext {
  config: Config;
  db: Database;
}

export type BackendContext = JwtContext & DbContext;

export function createContext(context: CreateContextContext): BackendContext {
  return {
    ...createDbContext(context),
    ...createJwtContext(context),
  };
}
