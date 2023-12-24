import type { PermissionService } from '#/services/interfaces/permission';
import type { PersonService } from '#/services/interfaces/person';
import type { SessionService } from '#/services/interfaces/session';
import type { UserService } from '#/services/interfaces/user';
import type { BackendContext, ContextCreatorContext } from '../..';

export interface Services {
  person: PersonService;
  session: SessionService;
  user: UserService;
}

export interface LoggedInServices {
  permission: PermissionService;
}

export interface BackendServicesContext {
  services: Services;
}

export interface BackendLoggedInServicesContext {
  services: LoggedInServices;
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO
  const services = null as any;

  return { services };
}

export function createLoggedInServicesContext(
  context: BackendContext,
  personId: string
): BackendLoggedInServicesContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO
  const services = null as any;

  return { services };
}
