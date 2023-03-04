import { ArrayCursor } from 'arangojs/cursor';
import { ArangoError } from 'arangojs/error';
import { ToCatchError } from '../utils';

export type MakePatch<T> = {
  [P in keyof T]?: MakePatch<T[P]>;
};

export interface Paginated<T> {
  nodes: T[];
  total: number;
}

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

export class RevMismatchError extends ToCatchError {}

export class IdNotFoundError extends ToCatchError {}

export const ARANGO_ERROR_NUM_REV_MISMATCH = 1200;
export const ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND = 1202;

export function handleArangoError(error: unknown): never {
  if (error instanceof ArangoError) {
    if (error.errorNum === ARANGO_ERROR_NUM_REV_MISMATCH) {
      throw new RevMismatchError();
    }
    if (error.errorNum === ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND) {
      throw new IdNotFoundError();
    }
  }

  throw error;
}
