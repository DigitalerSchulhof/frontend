import { CacheAdapter } from '#/backend/caches/adapters';
import { MemoryCacheAdapter } from '#/backend/caches/adapters/memory';
import { RedisCacheAdapter } from '#/backend/caches/adapters/redis';
import { VoidCacheAdapter } from '#/backend/caches/adapters/void';
import { Config } from '#/config';
import { __cache } from '#/utils/paths';
import * as path from 'path';

const CACHE_ADAPTERS_CACHE: {
  redis?: RedisCacheAdapter;
  memory?: MemoryCacheAdapter;
  void?: VoidCacheAdapter;
} = {};

export function createCacheAdapter(config: Config): CacheAdapter {
  switch (config.cache.engine) {
    case 'redis':
      if (!config.cache.redis) {
        throw new Error('Redis cache adapter requires redis config');
      }

      if (!CACHE_ADAPTERS_CACHE.redis) {
        CACHE_ADAPTERS_CACHE.redis = new RedisCacheAdapter(
          config.cache.redis.host,
          config.cache.redis.port,
          config.cache.redis.password
        );
      }

      return CACHE_ADAPTERS_CACHE.redis;
    case 'memory':
      if (!CACHE_ADAPTERS_CACHE.memory) {
        CACHE_ADAPTERS_CACHE.memory = new MemoryCacheAdapter(
          config.cache.shouldSaveMemoryToDisk
            ? path.join(__cache, 'memory')
            : undefined
        );
      }

      return CACHE_ADAPTERS_CACHE.memory;
    case 'void':
      if (!CACHE_ADAPTERS_CACHE.void) {
        CACHE_ADAPTERS_CACHE.void = new VoidCacheAdapter();
      }

      return CACHE_ADAPTERS_CACHE.void;
  }
}
