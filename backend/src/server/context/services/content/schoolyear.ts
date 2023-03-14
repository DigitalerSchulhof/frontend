import { CacheAdapter } from '#/caches/adapters';
import { ObjectCache } from '#/caches/object-cache';
import {
  Schoolyear,
  SchoolyearRepository,
} from '#/repositories/content/schoolyear';
import { SchoolyearService } from '#/services/content/schoolyear';
import { SchoolyearValidator } from '#/validators/content/schoolyear';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createSchoolyearService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [SchoolyearRepository, SchoolyearService] {
  const repo = new SchoolyearRepository(db);
  const cache = new ObjectCache<Schoolyear>(cacheAdapter, 'schoolyears');
  const validator = new SchoolyearValidator(repositories);

  return [repo, new SchoolyearService(repo, cache, validator, services)];
}
