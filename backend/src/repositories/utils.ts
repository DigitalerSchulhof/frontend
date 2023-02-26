import { ArrayCursor } from 'arangojs/cursor';
import { ToCatchError } from '../utils';

export type MakePatch<T> = {
  [P in keyof T]?: MakePatch<T[P]> | null;
};

export type Paginated<T> = {
  nodes: T[];
  total: number;
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

export class RevMismatchError extends ToCatchError {
  constructor() {
    super();
  }
}

export class IdDoesNotExistError extends ToCatchError {
  constructor() {
    super();
  }
}

export class DuplicateFieldsError extends ToCatchError {
  constructor(readonly conflictingFields: string[]) {
    super();
  }
}

export const ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND = 1202;
export const ARANGO_ERROR_NUM_REV_MISMATCH = 1200;
