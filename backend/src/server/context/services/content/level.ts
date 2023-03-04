import { CacheAdapter } from '@caches/adapters';
import { ObjectCache } from '@caches/object-cache';
import {
  Level,
  LevelRepository,
  LevelRepositoryImpl,
} from '@repositories/level';
import { LevelService } from '@services/level';
import { LevelValidator } from '@validators/level';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createLevelService(
  db: Database,
  cacheAdapter: CacheAdapter,
  repositories: Repositories,
  services: Services
): [LevelRepository, LevelService] {
  const repo = new LevelRepositoryImpl(db);
  const cache = new ObjectCache<Level>(cacheAdapter, 'levels');
  const validator = new LevelValidator(repositories, services);

  return [repo, new LevelService(repo, cache, validator)];
}
