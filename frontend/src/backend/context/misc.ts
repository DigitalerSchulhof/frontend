import { Config } from '#/backend/config';
import { ContextCreatorContext } from '#/backend/context';

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
