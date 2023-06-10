import { Database } from 'arangojs';
import * as aql from 'arangojs/aql';
import { DocumentCollection } from 'arangojs/collection';
import { ArrayCursor } from 'arangojs/cursor';
import { QueryOptions } from 'arangojs/database';
import { ArangoError } from 'arangojs/error';
import {
  ERROR_ARANGO_CONFLICT,
  ERROR_ARANGO_DOCUMENT_NOT_FOUND,
  IdNotFoundError,
  RevMismatchError,
} from './errors';
import { Filter } from './filters';
import {
  MakeSearchQuery,
  Paginated,
  filterToArangoQuery,
  searchQueryToArangoQuery,
} from './search';
import { MakePatch, paginateCursor } from './utils';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | {
      [key: string]: Serializable;
    };

export type WithId<Base> = Base & { id: string; rev: string };

export abstract class ArangoRepository<
  Name extends string,
  Base extends Record<string, Serializable>
> {
  protected abstract readonly collectionName: Name;

  private static docLiteral = aql.literal('doc');

  private _collectionNameLiteral: DocumentCollection | undefined;
  protected get collectionNameLiteral(): DocumentCollection {
    if (this._collectionNameLiteral === undefined) {
      this._collectionNameLiteral = this.db.collection(this.collectionName);
    }

    return this._collectionNameLiteral;
  }

  constructor(private readonly db: Database) {}

  async getById(id: string): Promise<WithId<Base> | null> {
    const res = await this.query<WithId<Base> | null>(
      aql.aql`
        LET doc = DOCUMENT(${this.collectionNameLiteral}, ${id})

        RETURN doc == null ? null : MERGE(
          UNSET(doc, "_key", "_id", "_rev"),
          {
            id: doc._key,
            rev: doc._rev
          }
        )
      `
    );
    // Unscrew syntax highlighting ``);

    return res.next() as Promise<WithId<Base> | null>;
  }

  async getByIds(ids: readonly string[]): Promise<(WithId<Base> | null)[]> {
    const res = await this.query<WithId<Base> | null>(
      aql.aql`
        FOR id IN ${ids}
          LET doc = DOCUMENT(${this.collectionNameLiteral}, id)

          RETURN doc == null ? null : MERGE(
            UNSET(doc, "_key", "_id", "_rev"),
            {
              id: doc._key,
              rev: doc._rev
            }
          )
      `
    );
    // Unscrew syntax highlighting ``);

    return res.all();
  }

  async create(post: Base): Promise<WithId<Base>> {
    const res = await this.query<WithId<Base>>(
      aql.aql`
        INSERT ${post} INTO ${this.collectionNameLiteral}

        RETURN MERGE(
          UNSET(NEW, "_key", "_id", "_rev"),
          {
            id: NEW._key,
            rev: NEW._rev
          }
        )
      `
    );
    // Unscrew syntax highlighting ``);

    return (await res.next())!;
  }

  async update(
    id: string,
    patch: MakePatch<Base>,
    ifRev?: string
  ): Promise<WithId<Base>> {
    const res = await this.query<WithId<Base>>(
      aql.aql`
        UPDATE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } WITH ${patch} IN ${
        this.collectionNameLiteral
      } OPTIONS { ignoreRevs: ${ifRev === undefined} }

        RETURN MERGE(
          UNSET(NEW, "_key", "_id", "_rev"),
          {
            id: NEW._key,
            rev: NEW._rev
          }
        )
      `
    );
    // Unscrew syntax highlighting ``);

    return (await res.next())!;
  }

  async delete(id: string, ifRev?: string): Promise<WithId<Base>> {
    const res = await this.query<WithId<Base>>(
      aql.aql`
        REMOVE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } IN ${this.collectionNameLiteral} OPTIONS { ignoreRevs: ${
        ifRev === undefined
      } }

        RETURN MERGE(
          UNSET(OLD, "_key", "_id", "_rev"),
          {
            id: OLD._key,
            rev: OLD._rev
          }
        )
      `
    );
    // Unscrew syntax highlighting ``);

    return (await res.next())!;
  }

  async filterDelete(filters: Filter<Name>): Promise<WithId<Base>[]> {
    const res = await this.query<WithId<Base>>(
      aql.aql`
        FOR doc IN ${this.collectionNameLiteral}
          ${filterToArangoQuery(ArangoRepository.docLiteral, filters)}

          REMOVE doc IN ${this.collectionNameLiteral}

          RETURN MERGE(
            UNSET(OLD, "_key", "_id", "_rev"),
            {
              id: OLD._key,
              rev: OLD._rev
            }
          )
      `
    );
    // Unscrew syntax highlighting ``);

    return res.all();
  }

  async search(query: MakeSearchQuery<Name>): Promise<Paginated<WithId<Base>>> {
    const res = await this.query<WithId<Base>>(
      aql.aql`
        FOR doc IN ${this.collectionNameLiteral}
          ${searchQueryToArangoQuery(ArangoRepository.docLiteral, query)}

          RETURN MERGE(
            UNSET(doc, "_key", "_id", "_rev"),
            {
              id: doc._key,
              rev: doc._rev
            }
          )
      `,
      { fullCount: true }
    );
    // Unscrew syntax highlighting ``);

    return paginateCursor(res);
  }

  async searchOne(query: MakeSearchQuery<Name>): Promise<WithId<Base> | null> {
    const res = await this.search(query);

    if (res.nodes.length > 1) {
      throw new Error('Expected one result, got more');
    }

    return res.nodes[0] ?? null;
  }

  async query<T>(
    query: aql.GeneratedAqlQuery,
    options?: QueryOptions
  ): Promise<ArrayCursor<T>> {
    try {
      return await this.db.query(query, options);
    } catch (error) {
      // TODO: Handle error handling (attach to error) better
      console.log(query);
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

    if (typeof error === 'object' && error !== null) {
      // It spams the console

      if ('request' in error) {
        delete error.request;
      }

      if ('response' in error) {
        delete error.response;
      }
    }

    throw error;
  }
}
