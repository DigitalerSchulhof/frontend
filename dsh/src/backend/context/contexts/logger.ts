import { Logger } from '#/log/server';
import { UserContextCreatorContext } from '..';

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
