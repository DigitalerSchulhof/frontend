import { Sort } from '../../sort';

export abstract class CourseSort extends Sort<'course'> {}

export class CourseIdSort extends CourseSort {
  protected readonly propertyName = '_key';
}

export class CourseNameSort extends CourseSort {
  protected readonly propertyName = 'name';
}

export class CourseClassIdSort extends CourseSort {
  protected readonly propertyName = 'classId';
}
