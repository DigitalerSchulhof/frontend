import { CreateContextContext } from '.';
import { database } from '../database';

export interface DbContext {
  db: ReturnType<typeof database>;
}

export function createDbContext(context: CreateContextContext): DbContext {
  return {
    db: database(context),
  };
}
