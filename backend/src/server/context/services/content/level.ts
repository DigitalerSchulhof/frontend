import { CacheAdapter } from '@caches/adapters';
import { ObjectCache } from '@caches/object-cache';
import { Level, LevelRepositoryImpl } from '@repositories/level';
import { LevelService } from '@services/level';
import { LevelValidatorImpl } from '@validators/level';
import { Database } from 'arangojs';

export function createLevelService(
  db: Database,
  cacheAdapter: CacheAdapter
): LevelService {
  const repo = new LevelRepositoryImpl(db);
  const cache = new ObjectCache<Level>(cacheAdapter, 'level');
  const validator = new LevelValidatorImpl();

  return new LevelService(repo, cache, validator);
}
