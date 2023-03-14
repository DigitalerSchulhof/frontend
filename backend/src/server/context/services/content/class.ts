import { CacheAdapter } from '#/caches/adapters';
import { ObjectCache } from '#/caches/object-cache';
import { Class, ClassRepository } from '#/repositories/content/class';
import { ClassService } from '#/services/content/class';
import { ClassValidator } from '#/validators/content/class';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createClassService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [ClassRepository, ClassService] {
  const repo = new ClassRepository(db);
  const cache = new ObjectCache<Class>(cacheAdapter, 'classes');
  const validator = new ClassValidator(repositories);

  return [repo, new ClassService(repo, cache, validator, services)];
}
