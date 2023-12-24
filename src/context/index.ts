import type { Config } from '#/config';
import { config } from '#/config';
import type { Account, Person } from '#/services/interfaces/person';
import { FormOfAddress } from '#/services/interfaces/person';
import type { Session } from '#/services/interfaces/session';
import type { ClientFormOfAddress } from '#/utils/client';
import assert from 'assert';
import type { BackendI18nContext } from './contexts/i18n';
import { createI18nContext } from './contexts/i18n';
import type { BackendLoggerContext } from './contexts/logger';
import { createLoggerContext } from './contexts/logger';
import type {
  BackendLoggedInServicesContext,
  BackendServicesContext,
} from './contexts/services';
import {
  createLoggedInServicesContext,
  createServicesContext,
} from './contexts/services';

export type ContextCreatorContext = {
  config: Config;
};

export type BackendContext = BackendServicesContext &
  BackendLoggerContext &
  BackendI18nContext;

export type LoggedInBackendContext = BackendContext &
  BackendLoggedInServicesContext & {
    /**
     * The ID of the currently logged in user's person.
     */
    personId: string;

    /**
     * The session of the user is logged in with.
     */
    session: Session;

    /**
     * The form of address of the currently logged in person.
     */
    formOfAddress: ClientFormOfAddress;

    /**
     * Gets the currently logged in user's person.
     */
    getPerson(): Promise<Person & { account: Account }>;
  };

function createContextCreatorContext(c: Config): ContextCreatorContext {
  return { config: c };
}

function createBackendContext(
  creatorContext: ContextCreatorContext
): BackendContext {
  return {
    ...createServicesContext(creatorContext),
    ...createLoggerContext(creatorContext),
    ...createI18nContext(),
  };
}

export function createLoggedInBackendContext(
  context: BackendContext,
  personId: string,
  session: Session,
  formOfAddress: FormOfAddress
): LoggedInBackendContext {
  const loggedInServicesContext = createLoggedInServicesContext(
    context,
    personId
  );

  return {
    ...context,
    services: {
      ...context.services,
      ...loggedInServicesContext.services,
    },
    personId,
    session,
    formOfAddress: (
      {
        [FormOfAddress.Informal]: 'informal',
        [FormOfAddress.Formal]: 'formal',
      } as const
    )[formOfAddress],
    async getPerson() {
      const res = await context.services.person.getPerson(personId);

      assert(res, 'Unexpected logged in context without person.');
      assert(res.account, 'Unexpected logged in context without account.');

      return res;
    },
  };
}

const creatorContext = createContextCreatorContext(config);
export const backendContext = createBackendContext(creatorContext);
