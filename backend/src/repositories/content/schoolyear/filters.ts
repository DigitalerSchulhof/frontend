import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  NumberFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';

export abstract class SchoolyearFilter extends Filter<'schoolyears'> {}

export abstract class ScalarSchoolyearFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean>
  >
> extends ScalarFilter<'schoolyears', FilterOperatorType> {}

export abstract class RelationalSchoolyearFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'schoolyears', RelatedFilter> {}

export class SchoolyearIdFilter extends ScalarSchoolyearFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class SchoolyearNameFilter extends ScalarSchoolyearFilter<StringFilterOperator> {
  protected readonly propertyName = 'name';
}

export class SchoolyearStartFilter extends ScalarSchoolyearFilter<NumberFilterOperator> {
  protected readonly propertyName = 'start';
}

export class SchoolyearEndFilter extends ScalarSchoolyearFilter<NumberFilterOperator> {
  protected readonly propertyName = 'end';
}
