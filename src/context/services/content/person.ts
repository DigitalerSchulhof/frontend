import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  PersonBase,
  PersonRepository,
} from '#/backend/repositories/content/person';
import { PersonService } from '#/backend/services/content/person';
import { PersonValidator } from '#/backend/validators/content/person';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createPersonService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [PersonRepository, PersonService] {
  const repo = new PersonRepository(db);
  const cache = new ObjectCache<WithId<PersonBase>>(cacheAdapter, 'persons');
  const validator = new PersonValidator(repositories);

  return [repo, new PersonService(repo, cache, validator, services)];
}
