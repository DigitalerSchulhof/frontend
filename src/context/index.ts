import type { Config } from '#/config';
import { config } from '#/config';
import type { Account } from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';
import type { Person } from '#/services/interfaces/person';
import type { Session } from '#/services/interfaces/session';
import type { BackendI18nContext } from './contexts/i18n';
import { createI18nContext } from './contexts/i18n';
import type { BackendLoggerContext } from './contexts/logger';
import { createLoggerContext } from './contexts/logger';
import type { BackendPermissionsContext } from './contexts/permission';
import { createPermissionsContext } from './contexts/permission';
import type { BackendServicesContext } from './contexts/services';
import { createServicesContext } from './contexts/services';

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

function createContextCreatorContext(c: Config): ContextCreatorContext {
  return { config: c };
}

function createBackendContext(c: Config): BackendContext {
  const creatorContext = createContextCreatorContext(c);

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
