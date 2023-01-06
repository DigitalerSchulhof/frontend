import { aql, Database } from 'arangojs';
import { CreateContextContext } from '.';

export interface BackendContext {
  db: Database;
  query: <T>(template: TemplateStringsArray, ...args: any[]) => Promise<T[]>;
}

export function createDbContext(context: CreateContextContext): BackendContext {
  const db = new Database({
    url: context.config.db.url,
    databaseName: context.config.db.databaseName,
  });

  return {
    db,
    query: (...args) => db.query(aql(...args)).then((cursor) => cursor.all()),
  };
}
