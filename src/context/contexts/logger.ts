import { Logger } from '#/log/server';
import type { ContextCreatorContext } from '..';

export interface BackendLoggerContext {
  logger: Logger;
}

export function createLoggerContext(
  contextCreatorContext: ContextCreatorContext
): BackendLoggerContext {
  const logger = new Logger();

  return {
    logger,
  };
}
