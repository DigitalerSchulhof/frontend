import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  IdentityTheftBase,
  IdentityTheftRepository,
} from '#/backend/repositories/content/identity-theft';
import { IdentityTheftService } from '#/backend/services/content/identity-theft';
import { IdentityTheftValidator } from '#/backend/validators/content/identity-theft';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createIdentityTheftService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [IdentityTheftRepository, IdentityTheftService] {
  const repo = new IdentityTheftRepository(db);
  const cache = new ObjectCache<WithId<IdentityTheftBase>>(
    cacheAdapter,
    'identity-thefts'
  );
  const validator = new IdentityTheftValidator(repositories);

  return [repo, new IdentityTheftService(repo, cache, validator, services)];
}
