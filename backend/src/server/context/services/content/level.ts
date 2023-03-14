import { CacheAdapter } from '#/caches/adapters';
import { ObjectCache } from '#/caches/object-cache';
import { Level, LevelRepository } from '#/repositories/content/level';
import { LevelService } from '#/services/content/level';
import { LevelValidator } from '#/validators/content/level';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createLevelService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [LevelRepository, LevelService] {
  const repo = new LevelRepository(db);
  const cache = new ObjectCache<Level>(cacheAdapter, 'levels');
  const validator = new LevelValidator(repositories);

  return [repo, new LevelService(repo, cache, validator, services)];
}
