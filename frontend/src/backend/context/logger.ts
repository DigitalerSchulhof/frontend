import { UserContextCreatorContext } from '#/backend/context';
import { Logger } from '#/backend/logger';

export interface BackendLoggerContext {
  logger: Logger;
}

export function createLoggerContext(
  userContextCreatorContext: UserContextCreatorContext
): BackendLoggerContext {
  const logger = new Logger();

  return {
    logger,
  };
}
