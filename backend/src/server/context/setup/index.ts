import { ContextCreatorContext } from '..';
import { Config } from '../../../config';
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
