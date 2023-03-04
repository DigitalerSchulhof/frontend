import { CacheAdapter } from '@caches/adapters';
import { ObjectCache } from '@caches/object-cache';
import { Schoolyear, SchoolyearRepositoryImpl } from '@repositories/schoolyear';
import { SchoolyearService } from '@services/schoolyear';
import { SchoolyearValidatorImpl } from '@validators/schoolyear';
import { Database } from 'arangojs';

export function createSchoolyearService(
  db: Database,
  cacheAdapter: CacheAdapter
): SchoolyearService {
  const repo = new SchoolyearRepositoryImpl(db);
  const cache = new ObjectCache<Schoolyear>(cacheAdapter, 'schoolyear');
  const validator = new SchoolyearValidatorImpl();

  return new SchoolyearService(repo, cache, validator);
}
