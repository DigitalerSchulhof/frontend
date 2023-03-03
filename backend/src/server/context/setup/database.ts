import { Database } from 'arangojs';
import { Config } from '../../../config';

export function createContextDatabase(config: Config) {
  const db = new Database({
    url: config.database.host,
    databaseName: config.database.name,
  });

  return db;
}
