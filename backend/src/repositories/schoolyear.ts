import { Schoolyear, SchoolyearInput } from '@services/schoolyear';
import { aql, Database } from 'arangojs';
import { ArangoError } from 'arangojs/error';
import {
  ARANGO_ERROR_NUM_DOCUMENT_NOT_FOUND,
  ARANGO_ERROR_NUM_REV_MISMATCH,
  DuplicateFieldsError,
  IdDoesNotExistError,
  MakePatch,
  paginateCursor,
  Paginated,
  RevMismatchError,
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

export class SchoolyearRepositoryImpl implements SchoolyearRepository {
  constructor(private readonly db: Database) {}

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
    await this.assertCanCreate(post);

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
    await this.assertCanUpdate(id, patch);

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

  private async assertCanCreate(post: SchoolyearInput): Promise<void> {
    const res = await this.db.query<Record<string, boolean>>(
      aql`
        LET name = LENGTH(
          FOR schoolyear IN schoolyears
            FILTER schoolyear.name == ${post.name}
            LIMIT 1
            RETURN schoolyear
        ) > 0

        RETURN {
          name
        }
      `
    );

    const duplicates = (await res.next())!;
    const fields = Object.keys(duplicates).filter((key) => duplicates[key]);

    if (fields.length) {
      throw new DuplicateFieldsError(fields);
    }
  }

  private async assertCanUpdate(
    id: string,
    patch: MakePatch<SchoolyearInput>
  ): Promise<void> {
    const res = await this.db.query<Record<string, boolean>>(
      aql`
        LET name = LENGTH(
          FOR schoolyear IN schoolyears
            FILTER schoolyear._key != ${id} && schoolyear.name == ${patch.name}
            LIMIT 1
            RETURN schoolyear
        ) == 1

        RETURN {
          name
        }
      `
    );

    const duplicates = (await res.next())!;
    const fields = Object.keys(duplicates).filter((key) => duplicates[key]);

    if (fields.length) {
      throw new DuplicateFieldsError(fields);
    }
  }
}
