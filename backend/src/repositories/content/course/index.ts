import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';
import {
  filtersToArangoQuery,
  MakeSearchQuery,
  Paginated,
  searchQueryToArangoQuery,
} from '../../search';
import { MakePatch, MakeSimpleRepository, paginateCursor } from '../../utils';
import { CourseFilter } from './filters';

export interface CourseBase {
  name: string;
  classId: string;
}

export type Course = WithId<CourseBase>;

export type CoursePatch = MakePatch<CourseBase>;

export type CourseSearchQuery = MakeSearchQuery<'course', Course>;

export type CourseRepository = MakeSimpleRepository<
  'course',
  Course,
  CourseBase,
  CoursePatch,
  CourseSearchQuery
>;

export class CourseRepositoryImpl
  extends ArangoRepository
  implements CourseRepository
{
  async getByIds(ids: readonly string[]): Promise<(Course | null)[]> {
    const res = await this.query<Course | null>(
      aql`
        FOR id IN ${ids}
          LET course = DOCUMENT(courses, id)

          RETURN course == null ? null : MERGE(
            UNSET(course, "_key", "_id", "_rev"),
            {
              id: course._key,
              rev: course._rev
            }
          )
      `
    );

    return res.all();
  }

  async create(post: CourseBase): Promise<Course> {
    const res = await this.query<Course>(
      aql`
        INSERT ${post} INTO courses

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
    patch: CoursePatch,
    ifRev?: string
  ): Promise<Course> {
    const res = await this.query<Course>(
      aql`
        UPDATE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } WITH ${patch} IN courses OPTIONS { ignoreRevs: ${
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

  async delete(id: string, ifRev?: string): Promise<Course> {
    const res = await this.query<Course>(
      aql`
        REMOVE {
          _key: ${id},
          _rev: ${ifRev ?? ''}
          } IN courses OPTIONS { ignoreRevs: ${ifRev === undefined} }

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

  async filterDelete(filter: CourseFilter): Promise<Course[]> {
    const res = await this.query<Course>(
      aql`
        FOR course IN courses
          ${filtersToArangoQuery('course', filter)}

          REMOVE course IN courses

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

  async search(query: CourseSearchQuery): Promise<Paginated<Course>> {
    const res = await this.query<Course>(
      aql`
        FOR course IN courses
          ${searchQueryToArangoQuery('course', query)}

          RETURN MERGE(
            UNSET(course, "_key", "_id", "_rev"),
            {
              id: course._key,
              rev: course._rev
            }
          )
      `,
      { fullCount: true }
    );

    return paginateCursor(res);
  }
}
