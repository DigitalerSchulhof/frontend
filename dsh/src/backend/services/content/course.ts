import {
  CourseBase,
  CourseRepository,
} from '#/backend/repositories/content/course';
import { Service } from '../base';

export class CourseService extends Service<
  'courses',
  CourseBase,
  CourseRepository
> {}
