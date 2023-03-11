import { ClassRepository } from '@repositories/class';
import { CourseRepository } from '@repositories/course';
import { LevelRepository } from '@repositories/level';
import { SchoolyearRepository } from '@repositories/schoolyear';
import { ClassService } from '@services/class';
import { CourseService } from '@services/course';
import { LevelService } from '@services/level';
import { SchoolyearService } from '@services/schoolyear';
import { ContextCreatorContext } from '..';
import { createClassService } from './content/class';
import { createCourseService } from './content/course';
import { createLevelService } from './content/level';
import { createSchoolyearService } from './content/schoolyear';

export interface Repositories {
  schoolyear: SchoolyearRepository;
  level: LevelRepository;
  class: ClassRepository;
  course: CourseRepository;
}

export interface Services {
  schoolyear: SchoolyearService;
  level: LevelService;
  class: ClassService;
  course: CourseService;
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
  };

  Object.assign(repositories, {
    schoolyear: content.schoolyear[0],
    level: content.level[0],
    class: content.class[0],
    course: content.course[0],
  } satisfies Repositories);

  Object.assign(services, {
    schoolyear: content.schoolyear[1],
    level: content.level[1],
    class: content.class[1],
    course: content.course[1],
  } satisfies Services);

  return {
    services,
  };
}
