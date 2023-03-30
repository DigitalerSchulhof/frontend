import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  SessionBase,
  SessionRepository,
} from '#/backend/repositories/content/session';
import { SessionService } from '#/backend/services/content/session';
import { SessionValidator } from '#/backend/validators/content/session';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createSessionService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [SessionRepository, SessionService] {
  const repo = new SessionRepository(db);
  const cache = new ObjectCache<WithId<SessionBase>>(cacheAdapter, 'sessions');
  const validator = new SessionValidator(repositories);

  return [repo, new SessionService(repo, cache, validator, services)];
}
