import { ContextCreatorContext } from '..';

export interface BackendMiscContext {}

export function createMiscContext(
  userContextCreatorContext: ContextCreatorContext
): BackendMiscContext {
  return {};
}
