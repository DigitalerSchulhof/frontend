import { TFunction } from '#/i18n/common/function';

export interface BackendI18nContext {
  t: TFunction;
}

export function createI18nContext(
  contextCreatorContext: ContextCreatorContext
): I18nContext {
  return {
    t: () => 'yo',
  };
}
