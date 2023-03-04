import { aql } from 'arangojs';
import { ArangoRepository } from '../arango';
import {
  MakePatch,
  Paginated,
  handleArangoError,
  paginateCursor
} from '../utils';

export interface SchoolyearBase {
  name: string;
  start: number;
  end: number;
}

export interface Schoolyear extends SchoolyearBase {
  id: string;
  rev: string;
}

export interface SchoolyearRepository {
  getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]>;
  getAll(): Promise<Paginated<Schoolyear>>;
  create(post: SchoolyearBase): Promise<Schoolyear>;
  update(
    id: string,
    patch: MakePatch<SchoolyearBase>,
    ifRev?: string
  ): Promise<Schoolyear>;
  delete(id: string, ifRev?: string): Promise<Schoolyear>;
}

export class SchoolyearRepositoryImpl
  extends ArangoRepository
  implements SchoolyearRepository
{
  async getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]> {
    const res = await this.db.query<Schoolyear | null>(
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

  async getAll(): Promise<Paginated<Schoolyear>> {
    const res = await this.db.query<Schoolyear>(
      aql`
        FOR schoolyear IN schoolyears
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

  async create(post: SchoolyearBase): Promise<Schoolyear> {
    const res = await this.db.query<Schoolyear>(
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
    patch: MakePatch<SchoolyearBase>,
    ifRev?: string
  ): Promise<Schoolyear> {
    let res;
    try {
      res = await this.db.query<Schoolyear>(
        aql`
          UPDATE {
            _key: ${id},
            _rev: ${ifRev}
           } WITH ${patch} IN schoolyears OPTIONS { ignoreRevs: false }

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

  async delete(id: string, ifRev?: string): Promise<Schoolyear> {
    let res;
    try {
      res = await this.db.query<Schoolyear>(
        aql`
          REMOVE {
            _key: ${id},
            _rev: ${ifRev}
           } IN schoolyears OPTIONS { ignoreRevs: false }

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
}
