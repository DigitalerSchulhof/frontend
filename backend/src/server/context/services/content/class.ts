import { CacheAdapter } from '@caches/adapters';
import { ObjectCache } from '@caches/object-cache';
import {
  Class,
  ClassRepository,
  ClassRepositoryImpl,
} from '@repositories/class';
import { ClassService } from '@services/class';
import { ClassValidator } from '@validators/class';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createClassService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [ClassRepository, ClassService] {
  const repo = new ClassRepositoryImpl(db);
  const cache = new ObjectCache<Class>(cacheAdapter, 'classes');
  const validator = new ClassValidator(repositories);

  return [repo, new ClassService(repo, cache, validator, services)];
}
