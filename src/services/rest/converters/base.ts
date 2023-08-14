import type { WithId as JsWithId } from '#/services/interfaces/base';
import type { WithId as RestWithId } from '#/services/rest/services/base';

export function idFromRest(id: RestWithId<unknown>): JsWithId<unknown> {
  return {
    id: id.id,
    rev: id.rev,
    updatedAt: new Date(id.updatedAt),
    createdAt: new Date(id.createdAt),
  };
}
