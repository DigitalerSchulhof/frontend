import { BaseService } from './base';

export interface Course {
  classId: string;
  name: string;
}

export interface CourseService extends BaseService<Course> {}
