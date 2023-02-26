import { Config } from '@config';
import { Database } from 'arangojs';

export function createContextDatabase(config: Config) {
  const db = new Database({
    url: config.database.host,
    databaseName: config.database.name,
  });

  return db;
}