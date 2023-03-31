import { Config } from '#/backend/config';
import { ContextCreatorContext } from '..';

export interface BackendMiscContext {
  config: Config;
}

export function createMiscContext(
  userContextCreatorContext: ContextCreatorContext
): BackendMiscContext {
  return {
    config: userContextCreatorContext.config,
  };
}
