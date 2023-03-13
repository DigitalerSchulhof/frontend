import { ArangoRepository, WithId } from '../../arango';
import { MakeSearchQuery } from '../../search';
import { MakePatch } from '../../utils';
import { CourseFilter } from './filters';

export type CourseBase = {
  name: string;
  classId: string;
};

export type Course = WithId<CourseBase>;

export type CoursePatch = MakePatch<CourseBase>;

export type CourseSearchQuery = MakeSearchQuery<Course, CourseFilter>;

export class CourseRepository extends ArangoRepository<
  Course,
  CourseBase,
  CoursePatch,
  CourseFilter,
  CourseSearchQuery
> {
  protected readonly collectionName = 'courses';
}
