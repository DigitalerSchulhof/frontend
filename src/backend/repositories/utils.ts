import * as aql from 'arangojs/aql';
import { ArrayCursor } from 'arangojs/cursor';
import { Paginated } from './search';

export type MakePatch<T> = {
  [P in keyof T]?: T[P];
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

export type AqlExpression = aql.GeneratedAqlQuery;
