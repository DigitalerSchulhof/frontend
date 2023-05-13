import { CacheAdapter } from '#/backend/caches/adapters';
import { Config } from '#/config';
import { Database } from 'arangojs';
import { createCacheAdapter } from './cache';
import { createDatabase } from './database';

export interface ContextCreatorContext {
  config: Config;
  db: Database;
  cacheAdapter: CacheAdapter;
}

export function createContextCreatorContext(
  config: Config
): ContextCreatorContext {
  return {
    config,
    db: createDatabase(config),
    cacheAdapter: createCacheAdapter(config),
  };
}
