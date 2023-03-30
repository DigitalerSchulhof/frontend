import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';

export abstract class PersonFilter extends Filter<'persons'> {}

export abstract class ScalarPersonFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean | null>
  >
> extends ScalarFilter<'persons', FilterOperatorType> {}

export abstract class RelationalPersonFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'persons', RelatedFilter> {}

export class PersonIdFilter extends ScalarPersonFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class PersonFirstnameFilter extends ScalarPersonFilter<StringFilterOperator> {
  protected readonly propertyName = 'firstname';
}
