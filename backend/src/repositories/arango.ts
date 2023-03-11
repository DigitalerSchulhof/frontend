import { Database } from 'arangojs';
import * as aql from 'arangojs/aql';
import { ArrayCursor } from 'arangojs/cursor';
import { QueryOptions } from 'arangojs/database';
import { ArangoError } from 'arangojs/error';
import {
  ERROR_ARANGO_CONFLICT,
  ERROR_ARANGO_DOCUMENT_NOT_FOUND,
  IdNotFoundError,
  RevMismatchError,
} from './errors';

export type WithId<Base> = Base & { id: string; rev: string };

export class ArangoRepository {
  constructor(private readonly db: Database) {}

  async query<T>(
    query: aql.GeneratedAqlQuery,
    options?: QueryOptions
  ): Promise<ArrayCursor<T>> {
    try {
      return await this.db.query(query, options);
    } catch (error) {
      this.handleError(error);
    }
  }

  protected handleError(error: unknown): never {
    if (error instanceof ArangoError) {
      if (error.errorNum === ERROR_ARANGO_CONFLICT) {
        throw new RevMismatchError();
      }
      if (error.errorNum === ERROR_ARANGO_DOCUMENT_NOT_FOUND) {
        throw new IdNotFoundError();
      }
    }

    throw error;
  }
}
