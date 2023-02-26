import { CacheAdapter } from '@caches/adapters';
import { Config } from '@config';
import { Database } from 'arangojs';
import {
  BackendPermissionsContext,
  createPermissionsContext,
} from './permission';
import { BackendServicesContext, createServicesContext } from './services';
import { createContextCreatorContext } from './setup';

export interface BackendContext
  extends BackendServicesContext,
    BackendPermissionsContext {}

export interface ContextCreatorContext {
  config: Config;
  db: Database;
  cacheAdapter: CacheAdapter;
}

export interface ContextCreatorUserContext extends ContextCreatorContext {}

export function createContextCreator(config: Config) {
  const createContextContext = createContextCreatorContext(config);

  const servicesContext = createServicesContext(createContextContext);

  return (): BackendContext => {
    const createContextUserContext = {
      ...createContextContext,
    };

    return {
      ...servicesContext,
      ...createPermissionsContext(createContextUserContext),
    };
  };
}
