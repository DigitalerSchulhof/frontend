import type { AccountService } from '#/services/interfaces/account';
import type { ClassService } from '#/services/interfaces/class';
import type { CourseService } from '#/services/interfaces/course';
import type { IdentityTheftService } from '#/services/interfaces/identity-theft';
import type { LevelService } from '#/services/interfaces/level';
import type { PersonService } from '#/services/interfaces/person';
import type { SchoolyearService } from '#/services/interfaces/schoolyear';
import type { SessionService } from '#/services/interfaces/session';
import type { ContextCreatorContext } from '../..';
import { createGrpcServices } from './grpc';

export interface Services {
  account: AccountService;
  class: ClassService;
  course: CourseService;
  identityTheft: IdentityTheftService;
  level: LevelService;
  person: PersonService;
  schoolyear: SchoolyearService;
  session: SessionService;
}

export interface BackendServicesContext {
  services: Services;
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  const services = createGrpcServices(context);

  return { services };
}
