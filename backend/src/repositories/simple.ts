import { Database, aql } from 'arangojs';
import { literal } from 'arangojs/aql';
import { ArangoRepository } from './arango';
import {
  AnonymousSearchQuery,
  Paginated,
  searchQueryToArangoQuery,
} from './search';
import { paginateCursor, handleArangoError } from './utils';

export type WithId<Base> = Base & { id: string; rev: string };

export interface SimpleRepository<
  BaseWithId,
  Base,
  Patch,
  SearchQuery extends AnonymousSearchQuery
> {
  getByIds(ids: readonly string[]): Promise<(BaseWithId | null)[]>;
  create(post: Base): Promise<BaseWithId>;
  update(id: string, patch: Patch, ifRev?: string): Promise<BaseWithId>;
  delete(id: string, ifRev?: string): Promise<BaseWithId>;
  search(query: SearchQuery): Promise<Paginated<BaseWithId>>;
}

export type ExtractRepositoryArgs<Repository> =
  Repository extends SimpleRepository<
    infer BaseWithId,
    infer Base,
    infer Patch,
    infer SearchQuery
  >
    ? [BaseWithId, Base, Patch, SearchQuery]
    : never;

export class SimpleArangoRepository<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Repository extends SimpleRepository<any, any, any, any>,
  BaseWithId extends Record<
    string,
    string | number | boolean
  > = ExtractRepositoryArgs<Repository>[0],
  Base extends Record<
    string,
    string | number | boolean
  > = ExtractRepositoryArgs<Repository>[1],
  Patch extends Record<
    string,
    string | number | boolean
  > = ExtractRepositoryArgs<Repository>[2],
  SearchQuery extends AnonymousSearchQuery = ExtractRepositoryArgs<Repository>[3]
> extends ArangoRepository {
  private readonly collectionNameAqlLiteral;

  constructor(db: Database, collectionName: string) {
    super(db);
    this.collectionNameAqlLiteral = literal(collectionName);
  }

  async getByIds(ids: readonly string[]): Promise<(BaseWithId | null)[]> {
    const res = await this.db.query(
      aql`
        FOR id IN ${ids}
          LET doc = DOCUMENT(${this.collectionNameAqlLiteral}, id)

          RETURN doc == null ? null : MERGE(
            UNSET(doc, "_key", "_id", "_rev"),
            {
              id: doc._key,
              rev: doc._rev
            }
          )
      `
    );

    return res.all();
  }

  async create(post: Base): Promise<BaseWithId> {
    const res = await this.db.query<BaseWithId>(
      aql`
        INSERT ${post} INTO ${this.collectionNameAqlLiteral}

        RETURN MERGE(
          UNSET(NEW, "_key", "_id", "_rev"),
          {
            id: NEW._key,
            rev: NEW._rev
          }
        )
      `
    );

    return (await res.next())!;
  }

  async update(id: string, patch: Patch, ifRev?: string): Promise<BaseWithId> {
    let res;
    try {
      res = await this.db.query<BaseWithId>(
        aql`
          UPDATE {
            _key: ${id},
            _rev: ${ifRev ?? ''}
           } WITH ${patch} IN ${
          this.collectionNameAqlLiteral
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
    } catch (err) {
      handleArangoError(err);
    }

    return (await res.next())!;
  }

  async delete(id: string, ifRev?: string): Promise<BaseWithId> {
    let res;
    try {
      res = await this.db.query<BaseWithId>(
        aql`
          REMOVE {
            _key: ${id},
            _rev: ${ifRev ?? ''}
           } IN ${this.collectionNameAqlLiteral} OPTIONS { ignoreRevs: ${
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
    } catch (err) {
      handleArangoError(err);
    }

    return (await res.next())!;
  }

  async search(query: SearchQuery): Promise<Paginated<BaseWithId>> {
    const res = await this.db.query<BaseWithId>(
      aql`
        FOR doc IN ${this.collectionNameAqlLiteral}
          ${searchQueryToArangoQuery('doc', query, (key) => {
            if (key === 'id') return '_key';
            if (key === 'rev') return '_rev';
            return key;
          })}

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

    return paginateCursor(res);
  }
}
