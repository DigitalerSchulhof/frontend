import { Config, config } from '#/config';
import { Account } from '#/services/interfaces/account';
import { WithId } from '#/services/interfaces/base';
import { Person } from '#/services/interfaces/person';
import { Session } from '#/services/interfaces/session';
import { BackendI18nContext, createI18nContext } from './contexts/i18n';
import { BackendLoggerContext, createLoggerContext } from './contexts/logger';
import {
  BackendPermissionsContext,
  createPermissionsContext,
} from './contexts/permission';
import {
  BackendServicesContext,
  createServicesContext,
} from './contexts/services';

export type ContextCreatorContext = {
  config: Config;
};

export type BackendContext = BackendServicesContext &
  BackendLoggerContext &
  BackendI18nContext;

export type LoggedInBackendContext = BackendContext &
  BackendPermissionsContext & {
    session: WithId<Session>;
    account: WithId<Account>;
    person: WithId<Person>;
  };

function createContextCreatorContext(config: Config): ContextCreatorContext {
  return { config };
}

function createBackendContext(config: Config): BackendContext {
  const creatorContext = createContextCreatorContext(config);

  return {
    ...createServicesContext(creatorContext),
    ...createLoggerContext(creatorContext),
    ...createI18nContext(),
  };
}

export function createLoggedInBackendContext(
  context: BackendContext,
  session: WithId<Session>,
  account: WithId<Account>,
  person: WithId<Person>
): LoggedInBackendContext {
  return {
    ...context,
    ...createPermissionsContext(context, account),
    session,
    account,
    person,
  };
}

export const backendContext = createBackendContext(config);
