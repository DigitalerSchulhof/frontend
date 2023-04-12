import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  NullableNumberFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';
import { PersonFilter, ScalarPersonFilter } from '../person/filters';

export abstract class AccountFilter extends Filter<'accounts'> {}

export abstract class ScalarAccountFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean | null>
  >
> extends ScalarFilter<'accounts', FilterOperatorType> {}

export abstract class RelationalAccountFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'accounts', RelatedFilter> {}

export class AccountIdFilter extends ScalarAccountFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class AccountPersonIdFilter extends ScalarAccountFilter<IDFilterOperator> {
  protected readonly propertyName = 'personId';
}

export class AccountPersonFilter extends RelationalAccountFilter<PersonFilter> {
  protected readonly propertyName = 'personId';
  protected readonly relatedCollection = 'persons';
}

export class AccountUsernameFilter extends ScalarAccountFilter<StringFilterOperator> {
  protected readonly propertyName = 'username';
}

export class AccountEmailFilter extends ScalarAccountFilter<StringFilterOperator> {
  protected readonly propertyName = 'email';
}

export class AccountPasswordFilter extends ScalarAccountFilter<StringFilterOperator> {
  protected readonly propertyName = 'password';
}

export class AccountLastLoginFilter extends ScalarPersonFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'lastLogin';
}

export class AccountSecondLastLoginFilter extends ScalarPersonFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'secondLastLogin';
}
