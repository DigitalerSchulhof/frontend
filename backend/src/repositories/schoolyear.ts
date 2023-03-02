import { Schoolyear, SchoolyearInput } from '@services/schoolyear';
import { aql } from 'arangojs';
import { ArangoError } from 'arangojs/error';
import { ArangoRepository } from './arango';
import {
  ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND,
  ARANGO_ERROR_NUM_REV_MISMATCH,
  IdDoesNotExistError,
  MakePatch,
  paginateCursor,
  Paginated,
  RevMismatchError
} from './utils';

export interface SchoolyearRepository {
  getByIds(ids: readonly string[]): Promise<(Schoolyear | null)[]>;
  getAll(): Promise<Paginated<Schoolyear>>;
  create(post: SchoolyearInput): Promise<Schoolyear>;
  update(
    id: string,
    patch: MakePatch<SchoolyearInput>,
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

  async create(post: SchoolyearInput): Promise<Schoolyear> {
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
    patch: MakePatch<SchoolyearInput>,
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
      if (err instanceof ArangoError) {
        if (err.errorNum === ARANGO_ERROR_NUM_REV_MISMATCH) {
          throw new RevMismatchError();
        }
        if (err.errorNum === ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND) {
          throw new IdDoesNotExistError();
        }
      }

      throw err;
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
      if (err instanceof ArangoError) {
        if (err.errorNum === ARANGO_ERROR_NUM_REV_MISMATCH) {
          throw new RevMismatchError();
        }
        if (err.errorNum === ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND) {
          throw new IdDoesNotExistError();
        }
      }

      throw err;
    }

    return (await res.next())!;
  }
}
