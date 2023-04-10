import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  NumberFilterOperator,
} from '../../filters/operators';
import { AccountFilter } from '../account/filters';

export abstract class SessionFilter extends Filter<'sessions'> {}

export abstract class ScalarSessionFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean | null>
  >
> extends ScalarFilter<'sessions', FilterOperatorType> {}

export abstract class RelationalSessionFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'sessions', RelatedFilter> {}

export class SessionIdFilter extends ScalarSessionFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class SessionAccountIdFilter extends ScalarSessionFilter<IDFilterOperator> {
  protected readonly propertyName = 'accountId';
}

export class SessionAccountFilter extends RelationalSessionFilter<AccountFilter> {
  protected readonly propertyName = 'accountId';
  protected readonly relatedCollection = 'accounts';
}

export class SessionIatFilter extends ScalarSessionFilter<NumberFilterOperator> {
  protected readonly propertyName = 'iat';
}

export class SessionDidShowLastLoginFilter extends ScalarSessionFilter<NumberFilterOperator> {
  protected readonly propertyName = 'didShowLastLogin';
}
