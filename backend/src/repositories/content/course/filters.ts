import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';
import { ClassFilter } from '../class/filters';

export abstract class CourseFilter extends Filter<'course'> {}

export abstract class ScalarCourseFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean>
  >
> extends ScalarFilter<'course', FilterOperatorType> {}

export abstract class RelationalCourseFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'course', RelatedFilter> {}

export class CourseIdFilter extends ScalarCourseFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class CourseNameFilter extends ScalarCourseFilter<StringFilterOperator> {
  protected readonly propertyName = 'name';
}

export class CourseClassIdFilter extends ScalarCourseFilter<IDFilterOperator> {
  protected readonly propertyName = 'classId';
}

export class CourseClassFilter extends RelationalCourseFilter<ClassFilter> {
  protected readonly propertyName = 'classId';
  protected readonly relatedCollection = 'classes';
}
