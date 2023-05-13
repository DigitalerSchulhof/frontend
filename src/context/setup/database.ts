import { Config } from '#/config';
import { Database } from 'arangojs';

export function createDatabase(config: Config): Database {
  const db = new Database({
    url: config.database.host,
    databaseName: config.database.name,
  });

  return db;
}
