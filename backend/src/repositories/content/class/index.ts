import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';
import {
  filtersToArangoQuery,
  MakeSearchQuery,
  Paginated,
  searchQueryToArangoQuery,
} from '../../search';
import { MakePatch, MakeSimpleRepository, paginateCursor } from '../../utils';
import { ClassFilter } from './filters';

export interface ClassBase {
  name: string;
  levelId: string;
}

export type Class = WithId<ClassBase>;

export type ClassPatch = MakePatch<ClassBase>;

export type ClassSearchQuery = MakeSearchQuery<'class', Class>;

export type ClassRepository = MakeSimpleRepository<
  'class',
  Class,
  ClassBase,
  ClassPatch,
  ClassSearchQuery
>;

export class ClassRepositoryImpl
  extends ArangoRepository
  implements ClassRepository
{
  async getByIds(ids: readonly string[]): Promise<(Class | null)[]> {
    const res = await this.query<Class | null>(
      aql`
        FOR id IN ${ids}
          LET class = DOCUMENT(classes, id)

          RETURN class == null ? null : MERGE(
            UNSET(class, "_key", "_id", "_rev"),
            {
              id: class._key,
              rev: class._rev
            }
          )
      `
    );

    return res.all();
  }

  async create(post: ClassBase): Promise<Class> {
    const res = await this.query<Class>(
      aql`
        INSERT ${post} INTO classes

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

  async update(id: string, patch: ClassPatch, ifRev?: string): Promise<Class> {
    const res = await this.query<Class>(
      aql`
        UPDATE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } WITH ${patch} IN classes OPTIONS { ignoreRevs: ${
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

  async delete(id: string, ifRev?: string): Promise<Class> {
    const res = await this.query<Class>(
      aql`
        REMOVE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } IN classes OPTIONS { ignoreRevs: ${ifRev === undefined} }

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

  async filterDelete(filters: ClassFilter): Promise<Class[]> {
    const res = await this.query<Class>(
      aql`
        FOR class IN classes
          ${filtersToArangoQuery('class', filters)}

          REMOVE class IN classes

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

  async search(query: ClassSearchQuery): Promise<Paginated<Class>> {
    const res = await this.query<Class>(
      aql`
        FOR class IN classes
          ${searchQueryToArangoQuery('class', query)}

          RETURN MERGE(
            UNSET(class, "_key", "_id", "_rev"),
            {
              id: class._key,
              rev: class._rev
            }
          )
      `,
      { fullCount: true }
    );

    return paginateCursor(res);
  }
}
