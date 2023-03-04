import { LevelService } from '@services/level';
import { SchoolyearService } from '@services/schoolyear';
import { ContextCreatorContext } from '..';
import { createLevelService } from './content/level';
import { createSchoolyearService } from './content/schoolyear';

export interface BackendServicesContext {
  services: {
    schoolyear: SchoolyearService;
    level: LevelService;
  };
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  return {
    services: {
      schoolyear: createSchoolyearService(context.db, context.cacheAdapter),
      level: createLevelService(context.db, context.cacheAdapter),
    },
  };
}
