import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';
import { SchoolyearFilter } from '../schoolyear/filters';

export abstract class LevelFilter extends Filter<'levels'> {}

export abstract class ScalarLevelFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean>
  >
> extends ScalarFilter<'levels', FilterOperatorType> {}

export abstract class RelationalLevelFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'levels', RelatedFilter> {}

export class LevelIdFilter extends ScalarLevelFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class LevelNameFilter extends ScalarLevelFilter<StringFilterOperator> {
  protected readonly propertyName = 'name';
}

export class LevelSchoolyearIdFilter extends ScalarLevelFilter<IDFilterOperator> {
  protected readonly propertyName = 'schoolyearId';
}

export class LevelSchoolyearFilter extends RelationalLevelFilter<SchoolyearFilter> {
  protected readonly propertyName = 'schoolyearId';
  protected readonly relatedCollection = 'schoolyears';
}
