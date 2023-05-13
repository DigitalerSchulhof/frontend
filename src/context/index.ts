import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { SessionBase } from '#/backend/repositories/content/session';
import { Config, config } from '#/config';
import { BackendI18nContext, createI18nContext } from './contexts/i18n';
import { BackendLoggerContext, createLoggerContext } from './contexts/logger';
import {
  BackendPermissionsContext,
  createPermissionsContext,
} from './contexts/permission';
import { BackendServicesContext, createServicesContext } from './services';
import { createContextCreatorContext } from './setup';

export interface BackendContext
  extends BackendServicesContext,
    BackendLoggerContext,
    BackendI18nContext {}

export interface LoggedInBackendContext
  extends BackendContext,
    BackendPermissionsContext {
  session: WithId<SessionBase>;
  account: WithId<AccountBase>;
  person: WithId<PersonBase>;
}

function createBackendContext(config: Config): BackendContext {
  const creatorContext = createContextCreatorContext(config);

  const servicesContext = createServicesContext(creatorContext);
  const loggerContext = createLoggerContext(creatorContext);
  const i18nContext = createI18nContext();

  return {
    ...servicesContext,
    ...loggerContext,
    ...i18nContext,
  };
}

export function createLoggedInBackendContext(
  context: BackendContext,
  session: WithId<SessionBase>,
  account: WithId<AccountBase>,
  person: WithId<PersonBase>
): LoggedInBackendContext {
  const permissionsContext = createPermissionsContext(context, account);

  return {
    ...context,
    ...permissionsContext,
    session,
    account,
    person,
  };
}

export const backendContext = createBackendContext(config);
