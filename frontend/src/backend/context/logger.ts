import { UserContextCreatorContext } from '#/backend/context';

export interface BackendLoggerContext {
  logger: {};
}

export function createLoggerContext(
  userContextCreatorContext: UserContextCreatorContext
): BackendLoggerContext {
  const logger = {};

  return {
    logger,
  };
}
