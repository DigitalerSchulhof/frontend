import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';
import { LevelFilter } from '../level/filters';

export abstract class ClassFilter extends Filter<'classes'> {}

export abstract class ScalarClassFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean>
  >
> extends ScalarFilter<'classes', FilterOperatorType> {}

export abstract class RelationalClassFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'classes', RelatedFilter> {}

export class ClassIdFilter extends ScalarClassFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class ClassNameFilter extends ScalarClassFilter<StringFilterOperator> {
  protected readonly propertyName = 'name';
}

export class ClassLevelIdFilter extends ScalarClassFilter<IDFilterOperator> {
  protected readonly propertyName = 'levelId';
}

export class ClassLevelFilter extends RelationalClassFilter<LevelFilter> {
  protected readonly propertyName = 'levelId';
  protected readonly relatedCollection = 'levels';
}
