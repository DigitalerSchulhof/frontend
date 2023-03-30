import { CacheAdapter } from '#/backend/caches/adapters';
import { Config, loadConfig } from '#/backend/config';
import { Database } from 'arangojs';
import { BackendLoggerContext, createLoggerContext } from './logger';
import {
  BackendPermissionsContext,
  createPermissionsContext,
} from './permission';
import { BackendServicesContext, createServicesContext } from './services';
import { createContextCreatorContext } from './setup';
import { BackendMiscContext, createMiscContext } from '#/backend/context/misc';

export interface BackendContext
  extends BackendMiscContext,
    BackendServicesContext,
    BackendPermissionsContext,
    BackendLoggerContext {}

export interface ContextCreatorContext {
  config: Config;
  db: Database;
  cacheAdapter: CacheAdapter;
}

export interface UserContextCreatorContext extends ContextCreatorContext {}

export function createContextCreator(
  config: Config
): (req: Request) => BackendContext {
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

const config = loadConfig();

export const getContext = createContextCreator(config);
