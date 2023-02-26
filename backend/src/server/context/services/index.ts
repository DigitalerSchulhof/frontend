import { SchoolyearService } from '@services/schoolyear';
import { ContextCreatorContext } from '..';
import { createSchoolyearService } from './schoolyear';

export interface BackendServicesContext {
  services: {
    schoolyear: SchoolyearService;
  };
}

export function createServicesContext(
  context: ContextCreatorContext
): BackendServicesContext {
  return {
    services: {
      schoolyear: createSchoolyearService(context.db, context.cacheAdapter),
    },
  };
}
