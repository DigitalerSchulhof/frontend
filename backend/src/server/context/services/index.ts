import { LevelRepository } from '@repositories/level';
import { SchoolyearRepository } from '@repositories/schoolyear';
import { LevelService } from '@services/level';
import { SchoolyearService } from '@services/schoolyear';
import { ContextCreatorContext } from '..';
import { createLevelService } from './content/level';
import { createSchoolyearService } from './content/schoolyear';

export interface Repositories {
  schoolyear: SchoolyearRepository;
  level: LevelRepository;
}

export interface Services {
  schoolyear: SchoolyearService;
  level: LevelService;
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
      repositories
    ),
    level: createLevelService(context.db, context.cacheAdapter, repositories),
  };

  Object.assign(repositories, {
    schoolyear: content.schoolyear[0],
    level: content.level[0],
  } satisfies Repositories);

  Object.assign(services, {
    schoolyear: content.schoolyear[1],
    level: content.level[1],
  } satisfies Services);

  return {
    services,
  };
}
