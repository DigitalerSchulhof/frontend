import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  NumberFilterOperator,
} from '../../filters/operators';
import { PersonFilter } from '../person/filters';

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

export class SessionPersonIdFilter extends ScalarSessionFilter<IDFilterOperator> {
  protected readonly propertyName = 'personId';
}

export class SessionPersonFilter extends RelationalSessionFilter<PersonFilter> {
  protected readonly propertyName = 'personId';
  protected readonly relatedCollection = 'persons';
}

export class SessionIatFilter extends ScalarSessionFilter<NumberFilterOperator> {
  protected readonly propertyName = 'iat';
}
