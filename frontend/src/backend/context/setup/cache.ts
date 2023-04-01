import { CacheAdapter } from '#/backend/caches/adapters';
import { MemoryCacheAdapter } from '#/backend/caches/adapters/memory';
import { RedisCacheAdapter } from '#/backend/caches/adapters/redis';
import { VoidCacheAdapter } from '#/backend/caches/adapters/void';
import { Config } from '#/config';

export function createCacheAdapter(config: Config): CacheAdapter {
  switch (config.cache.engine) {
    case 'redis':
      if (!config.cache.redis) {
        throw new Error('Redis cache adapter requires redis config');
      }

      return new RedisCacheAdapter(
        config.cache.redis.host,
        config.cache.redis.port,
        config.cache.redis.password
      );
    case 'memory':
      return new MemoryCacheAdapter();
    case 'void':
      return new VoidCacheAdapter();
  }
}
