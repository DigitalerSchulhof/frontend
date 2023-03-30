import { Config } from '#/backend/config';
import { ContextCreatorContext } from '..';
import { createCacheAdapter } from './cache';
import { createContextDatabase } from './database';

export function createContextCreatorContext(
  config: Config
): ContextCreatorContext {
  return {
    config,
    db: createContextDatabase(config),
    cacheAdapter: createCacheAdapter(config),
  };
}
