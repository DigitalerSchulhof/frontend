import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  LevelBase,
  LevelRepository,
} from '#/backend/repositories/content/level';
import { LevelService } from '#/backend/services/content/level';
import { LevelValidator } from '#/backend/validators/content/level';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createLevelService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [LevelRepository, LevelService] {
  const repo = new LevelRepository(db);
  const cache = new ObjectCache<WithId<LevelBase>>(cacheAdapter, 'levels');
  const validator = new LevelValidator(repositories);

  return [repo, new LevelService(repo, cache, validator, services)];
}
