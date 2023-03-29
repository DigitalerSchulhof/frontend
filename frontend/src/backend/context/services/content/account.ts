import { CacheAdapter } from '#/backend/caches/adapters';
import { ObjectCache } from '#/backend/caches/object-cache';
import { WithId } from '#/backend/repositories/arango';
import {
  AccountBase,
  AccountRepository,
} from '#/backend/repositories/content/account';
import { AccountService } from '#/backend/services/content/account';
import { AccountValidator } from '#/backend/validators/content/account';
import { Database } from 'arangojs';
import { Repositories, Services } from '..';

export function createAccountService(
  db: Database,
  cacheAdapter: CacheAdapter,
  services: Services,
  repositories: Repositories
): [AccountRepository, AccountService] {
  const repo = new AccountRepository(db);
  const cache = new ObjectCache<WithId<AccountBase>>(cacheAdapter, 'accounts');
  const validator = new AccountValidator(repositories);

  return [repo, new AccountService(repo, cache, validator, services)];
}
