import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  NullableIDFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';
import { AccountFilter } from '../account/filters';

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

export class PersonAccountIdFilter extends ScalarPersonFilter<NullableIDFilterOperator> {
  protected readonly propertyName = 'accountId';
}

export class PersonAccountFilter extends RelationalPersonFilter<AccountFilter> {
  protected readonly propertyName = 'accountId';
  protected readonly relatedCollection = 'accounts';
}

export class PersonFirstnameFilter extends ScalarPersonFilter<StringFilterOperator> {
  protected readonly propertyName = 'firstname';
}
