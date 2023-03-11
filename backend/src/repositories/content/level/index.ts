import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';
import {
  filtersToArangoQuery,
  MakeSearchQuery,
  Paginated,
  searchQueryToArangoQuery,
} from '../../search';
import { MakePatch, MakeSimpleRepository, paginateCursor } from '../../utils';
import { LevelFilter } from './filters';

export interface LevelBase {
  name: string;
  schoolyearId: string;
}

export type Level = WithId<LevelBase>;

export type LevelPatch = MakePatch<LevelBase>;

export type LevelSearchQuery = MakeSearchQuery<'level', Level>;

export type LevelRepository = MakeSimpleRepository<
  'level',
  Level,
  LevelBase,
  LevelPatch,
  LevelSearchQuery
>;

export class LevelRepositoryImpl
  extends ArangoRepository
  implements LevelRepository
{
  async getByIds(ids: readonly string[]): Promise<(Level | null)[]> {
    const res = await this.query<Level | null>(
      aql`
        FOR id IN ${ids}
          LET level = DOCUMENT(levels, id)

          RETURN level == null ? null : MERGE(
            UNSET(level, "_key", "_id", "_rev"),
            {
              id: level._key,
              rev: level._rev
            }
          )
      `
    );

    return res.all();
  }

  async create(post: LevelBase): Promise<Level> {
    const res = await this.query<Level>(
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
    const res = await this.query<Level>(
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

    return (await res.next())!;
  }

  async delete(id: string, ifRev?: string): Promise<Level> {
    const res = await this.query<Level>(
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

    return (await res.next())!;
  }

  async filterDelete(filter: LevelFilter): Promise<Level[]> {
    const res = await this.query<Level>(
      aql`
        FOR level IN levels
          ${filtersToArangoQuery('level', filter)}

          REMOVE level IN levels

          RETURN MERGE(
            UNSET(OLD, "_key", "_id", "_rev"),
            {
              id: OLD._key,
              rev: OLD._rev
            }
          )
      `
    );

    return res.all();
  }

  async search(query: LevelSearchQuery): Promise<Paginated<Level>> {
    const res = await this.query<Level>(
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
