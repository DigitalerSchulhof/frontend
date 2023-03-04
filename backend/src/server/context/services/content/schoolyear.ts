import { CacheAdapter } from '@caches/adapters';
import { ObjectCache } from '@caches/object-cache';
import {
  Schoolyear,
  SchoolyearRepository,
  SchoolyearRepositoryImpl,
} from '@repositories/schoolyear';
import { SchoolyearService } from '@services/schoolyear';
import { SchoolyearValidator } from '@validators/schoolyear';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createSchoolyearService(
  db: Database,
  cacheAdapter: CacheAdapter,
  repositories: Repositories,
  services: Services
): [SchoolyearRepository, SchoolyearService] {
  const repo = new SchoolyearRepositoryImpl(db);
  const cache = new ObjectCache<Schoolyear>(cacheAdapter, 'schoolyears');
  const validator = new SchoolyearValidator(repositories, services);

  return [repo, new SchoolyearService(repo, cache, validator)];
}
