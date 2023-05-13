import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  FilterOperator,
  IDFilterOperator,
  NumberFilterOperator,
} from '../../filters/operators';
import { PersonFilter } from '../person/filters';

export abstract class IdentityTheftFilter extends Filter<'identity-thefts'> {}

export abstract class ScalarIdentityTheftFilter<
  FilterOperatorType extends FilterOperator<
    MaybeArray<string | number | boolean | null>
  >
> extends ScalarFilter<'identity-thefts', FilterOperatorType> {}

export abstract class RelationalIdentityTheftFilter<
  RelatedFilter extends Filter<unknown>
> extends RelationalFilter<'identity-thefts', RelatedFilter> {}

export class IdentityTheftIdFilter extends ScalarIdentityTheftFilter<IDFilterOperator> {
  protected readonly propertyName = '_key';
}

export class IdentityTheftPersonIdFilter extends ScalarIdentityTheftFilter<IDFilterOperator> {
  protected readonly propertyName = 'personId';
}

export class IdentityTheftPersonFilter extends RelationalIdentityTheftFilter<PersonFilter> {
  protected readonly propertyName = 'personId';
  protected readonly relatedCollection = 'persons';
}

export class IdentityTheftReportedAtFilter extends ScalarIdentityTheftFilter<NumberFilterOperator> {
  protected readonly propertyName = 'reportedAt';
}
