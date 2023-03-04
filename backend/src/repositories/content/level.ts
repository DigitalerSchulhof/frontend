import { aql } from 'arangojs';
import { ArangoRepository } from '../arango';
import { Paginated, SearchQuery, searchQueryToArangoQuery } from '../search';
import { MakePatch, handleArangoError, paginateCursor } from '../utils';

export interface LevelBase {
  name: string;
  schoolyearId: string;
}

export type LevelPatch = MakePatch<Omit<LevelBase, 'schoolyearId'>>;

export interface Level extends LevelBase {
  id: string;
  rev: string;
}

export interface LevelSearchQuery
  extends SearchQuery<Level, 'id' | 'name' | 'schoolyearId'> {}

export interface LevelRepository {
  getByIds(ids: readonly string[]): Promise<(Level | null)[]>;
  getAll(): Promise<Paginated<Level>>;
  create(post: LevelBase): Promise<Level>;
  update(id: string, patch: LevelPatch, ifRev?: string): Promise<Level>;
  delete(id: string, ifRev?: string): Promise<Level>;
  search(query: LevelSearchQuery): Promise<Paginated<Level>>;
}

export class LevelRepositoryImpl
  extends ArangoRepository
  implements LevelRepository
{
  async getByIds(ids: readonly string[]): Promise<(Level | null)[]> {
    const res = await this.db.query<Level | null>(
      aql`
        FOR id IN ${ids}
          LET level = DOCUMENT(levels, id)

          RETURN level == null ? null : MERGE(
            UNSET(level, "_key", "_id", "_rev"),
            {
              id: level._key,
              rev: level._rev,
            }
          )
      `
    );

    return res.all();
  }

  async getAll(): Promise<Paginated<Level>> {
    const res = await this.db.query<Level>(
      aql`
        FOR level IN levels
          RETURN MERGE(
            UNSET(level, "_key", "_id", "_rev"),
            {
              id: level._key,
              rev: level._rev
            }
          )
      `,
      { fullCount: true }
    );

    return paginateCursor(res);
  }

  async create(post: LevelBase): Promise<Level> {
    const res = await this.db.query<Level>(
      aql`
        INSERT ${post} INTO levels

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

  async update(id: string, patch: LevelPatch, ifRev?: string): Promise<Level> {
    let res;
    try {
      res = await this.db.query<Level>(
        aql`
          UPDATE {
            _key: ${id},
            _rev: ${ifRev ?? ''}
           } WITH ${patch} IN levels OPTIONS { ignoreRevs: ${
          ifRev === undefined
        } }

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

  async delete(id: string, ifRev?: string): Promise<Level> {
    let res;
    try {
      res = await this.db.query<Level>(
        aql`
          REMOVE {
            _key: ${id},
            _rev: ${ifRev ?? ''}
           } IN levels OPTIONS { ignoreRevs: ${ifRev === undefined} }

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

  async search(query: LevelSearchQuery): Promise<Paginated<Level>> {
    const res = await this.db.query<Level>(
      aql`
        FOR level IN levels
          ${searchQueryToArangoQuery('level', query)}

          RETURN MERGE(
            UNSET(level, "_key", "_id", "_rev"),
            {
              id: level._key,
              rev: level._rev
            }
          )
      `,
      { fullCount: true }
    );

    return paginateCursor(res);
  }
}
