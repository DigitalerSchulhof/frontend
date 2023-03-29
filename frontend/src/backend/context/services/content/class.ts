import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  ClassBase,
  ClassRepository,
} from '#/backend/repositories/content/class';
import { ClassService } from '#/backend/services/content/class';
import { ClassValidator } from '#/backend/validators/content/class';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createClassService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [ClassRepository, ClassService] {
  const repo = new ClassRepository(db);
  const cache = new ObjectCache<WithId<ClassBase>>(cacheAdapter, 'classes');
  const validator = new ClassValidator(repositories);

  return [repo, new ClassService(repo, cache, validator, services)];
}
