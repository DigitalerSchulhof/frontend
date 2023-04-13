import { CacheAdapter } from '#/backend/caches/adapters';
import { Config, config } from '#/config';
import { Database } from 'arangojs';
import { BackendLoggerContext, createLoggerContext } from './contexts/logger';
import { BackendMiscContext, createMiscContext } from './contexts/misc';
import {
  BackendPermissionsContext,
  createPermissionsContext,
} from './contexts/permission';
import { BackendServicesContext, createServicesContext } from './services';
import { createContextCreatorContext } from './setup';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { SessionBase } from '#/backend/repositories/content/session';

export interface BackendContext
  extends BackendMiscContext,
    BackendServicesContext,
    BackendPermissionsContext,
    BackendLoggerContext {}

export interface LoggedInBackendContext extends BackendContext {
  session: WithId<SessionBase>;
  person: WithId<PersonBase>;
  account: WithId<AccountBase>;
}

export interface ContextCreatorContext {
  config: Config;
  db: Database;
  cacheAdapter: CacheAdapter;
}

export interface UserContextCreatorContext extends ContextCreatorContext {}

export function createContextCreator(
  config: Config
): (req?: Request) => BackendContext {
  const contextCreatorContext = createContextCreatorContext(config);

  const servicesContext = createServicesContext(contextCreatorContext);
  const miscContext = createMiscContext(contextCreatorContext);

  const persistentContext = {
    ...servicesContext,
    ...miscContext,
  };

  return (): BackendContext => {
    const userContextCreatorContext: UserContextCreatorContext = {
      ...contextCreatorContext,
    };

    return {
      ...persistentContext,
      ...createPermissionsContext(userContextCreatorContext),
      ...createLoggerContext(userContextCreatorContext),
    };
  };
}

export const getContext = createContextCreator(config);