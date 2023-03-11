import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';
import {
  filtersToArangoQuery,
  MakeSearchQuery,
  Paginated,
  searchQueryToArangoQuery,
} from '../../search';
import { MakePatch, MakeSimpleRepository, paginateCursor } from '../../utils';
import { SchoolyearFilter } from './filters';

export interface SchoolyearBase {
  name: string;
  start: number;
  end: number;
}

export type Schoolyear = WithId<SchoolyearBase>;

export type SchoolyearPatch = MakePatch<SchoolyearBase>;

export type SchoolyearSearchQuery = MakeSearchQuery<'schoolyear', Schoolyear>;

export type SchoolyearRepository = MakeSimpleRepository<
  'schoolyear',
  Schoolyear,
  SchoolyearBase,
  SchoolyearPatch,
  SchoolyearSearchQuery
>;

export class SchoolyearRepositoryImpl
  extends ArangoRepository
  implements SchoolyearRepository
{
  async getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]> {
    const res = await this.query<Schoolyear | null>(
      aql`
        FOR id IN ${ids}
          LET schoolyear = DOCUMENT(schoolyears, id)

          RETURN schoolyear == null ? null : MERGE(
            UNSET(schoolyear, "_key", "_id", "_rev"),
            {
              id: schoolyear._key,
              rev: schoolyear._rev
            }
          )
      `
    );

    return res.all();
  }

  async create(post: SchoolyearBase): Promise<Schoolyear> {
    const res = await this.query<Schoolyear>(
      aql`
        INSERT ${post} INTO schoolyears

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

  async update(
    id: string,
    patch: SchoolyearPatch,
    ifRev?: string
  ): Promise<Schoolyear> {
    const res = await this.query<Schoolyear>(
      aql`
        UPDATE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } WITH ${patch} IN schoolyears OPTIONS { ignoreRevs: ${
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

  async delete(id: string, ifRev?: string): Promise<Schoolyear> {
    const res = await this.query<Schoolyear>(
      aql`
        REMOVE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } IN schoolyears OPTIONS { ignoreRevs: ${ifRev === undefined} }

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

  async filterDelete(filter: SchoolyearFilter): Promise<Schoolyear[]> {
    const res = await this.query<Schoolyear>(
      aql`
        FOR schoolyear IN schoolyears
          ${filtersToArangoQuery('schoolyear', filter)}

          REMOVE schoolyear IN schoolyears

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

  async search(query: SchoolyearSearchQuery): Promise<Paginated<Schoolyear>> {
    const res = await this.query<Schoolyear>(
      aql`
        FOR schoolyear IN schoolyears
          ${searchQueryToArangoQuery('schoolyear', query)}

          RETURN MERGE(
            UNSET(schoolyear, "_key", "_id", "_rev"),
            {
              id: schoolyear._key,
              rev: schoolyear._rev
            }
          )
      `,
      { fullCount: true }
    );

    return paginateCursor(res);
  }
}
