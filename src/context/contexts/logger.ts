import { Logger } from '#/log/server';
import { ContextCreatorContext } from '../setup';

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
