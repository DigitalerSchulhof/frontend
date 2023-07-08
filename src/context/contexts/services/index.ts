import { AccountService } from '#/services/interfaces/account';
import { ClassService } from '#/services/interfaces/class';
import { CourseService } from '#/services/interfaces/course';
import { IdentityTheftService } from '#/services/interfaces/identity-theft';
import { LevelService } from '#/services/interfaces/level';
import { PersonService } from '#/services/interfaces/person';
import { SchoolyearService } from '#/services/interfaces/schoolyear';
import { SessionService } from '#/services/interfaces/session';
import { ContextCreatorContext } from '../..';
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
