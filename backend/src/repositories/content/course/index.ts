import { ArangoRepository } from '../../arango';

export type CourseBase = {
  name: string;
  classId: string;
};

export class CourseRepository extends ArangoRepository<'courses', CourseBase> {
  protected readonly collectionName = 'courses';
}
