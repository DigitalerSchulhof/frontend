import { ArrayCursor } from 'arangojs/cursor';
import { MakeSearchQuery, Paginated } from './search';

export type MakePatch<T> = {
  [P in keyof T]?: MakePatch<T[P]>;
};

export async function paginateCursor<T>(
  cursor: ArrayCursor<T>
): Promise<Paginated<T>> {
  if (cursor.extra.stats?.fullCount === undefined) {
    throw new Error("Cursor is not paginated. Use '{ fullCount: true }'");
  }

  return {
    nodes: await cursor.all(),
    total: cursor.extra.stats.fullCount,
  };
}

export interface MakeSimpleRepository<
  BaseWithId,
  Base,
  Patch,
  SearchQuery extends MakeSearchQuery<unknown>
> {
  getByIds(ids: readonly string[]): Promise<(BaseWithId | null)[]>;
  create(post: Base): Promise<BaseWithId>;
  update(id: string, patch: Patch, ifRev?: string): Promise<BaseWithId>;
  delete(id: string, ifRev?: string): Promise<BaseWithId>;
  search(query: SearchQuery): Promise<Paginated<BaseWithId>>;
}
