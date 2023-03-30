import { AccountRepository } from '#/backend/repositories/content/account';
import { ClassRepository } from '#/backend/repositories/content/class';
import { CourseRepository } from '#/backend/repositories/content/course';
import { LevelRepository } from '#/backend/repositories/content/level';
import { PersonRepository } from '#/backend/repositories/content/person';
import { SchoolyearRepository } from '#/backend/repositories/content/schoolyear';
import { SessionRepository } from '#/backend/repositories/content/session';
import { AccountService } from '#/backend/services/content/account';
import { ClassService } from '#/backend/services/content/class';
import { CourseService } from '#/backend/services/content/course';
import { LevelService } from '#/backend/services/content/level';
import { PersonService } from '#/backend/services/content/person';
import { SchoolyearService } from '#/backend/services/content/schoolyear';
import { SessionService } from '#/backend/services/content/session';
import { ContextCreatorContext } from '..';
import { createAccountService } from './content/account';
import { createClassService } from './content/class';
import { createCourseService } from './content/course';
import { createLevelService } from './content/level';
import { createPersonService } from './content/person';
import { createSchoolyearService } from './content/schoolyear';
import { createSessionService } from './content/session';

export interface Repositories {
  schoolyear: SchoolyearRepository;
  level: LevelRepository;
  class: ClassRepository;
  course: CourseRepository;
  person: PersonRepository;
  account: AccountRepository;
  session: SessionRepository;
}

export interface Services {
  schoolyear: SchoolyearService;
  level: LevelService;
  class: ClassService;
  course: CourseService;
  person: PersonService;
  account: AccountService;
  session: SessionService;
}

export interface BackendServicesContext {
  services: Services;
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  const repositories = {} as Repositories;
  const services = {} as Services;

  const content = {
    schoolyear: createSchoolyearService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
    level: createLevelService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
    class: createClassService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
    course: createCourseService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
    person: createPersonService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
    account: createAccountService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
    session: createSessionService(
      context.db,
      context.cacheAdapter,
      services,
      repositories
    ),
  };

  Object.assign(repositories, {
    schoolyear: content.schoolyear[0],
    level: content.level[0],
    class: content.class[0],
    course: content.course[0],
    person: content.person[0],
    account: content.account[0],
    session: content.session[0],
  } satisfies Repositories);

  Object.assign(services, {
    schoolyear: content.schoolyear[1],
    level: content.level[1],
    class: content.class[1],
    course: content.course[1],
    person: content.person[1],
    account: content.account[1],
    session: content.session[1],
  } satisfies Services);

  return {
    services,
  };
}
