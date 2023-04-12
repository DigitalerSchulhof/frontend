import { AccountFilter } from '#/backend/repositories/content/account/filters';
import { FormOfAddress, PersonGender, PersonType } from '.';
import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  EqFilterOperator,
  FilterOperator,
  IDFilterOperator,
  InFilterOperator,
  NeqFilterOperator,
  NinFilterOperator,
  NullableStringFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';

export type FormOfAddressFilterOperator =
  | EqFilterOperator<FormOfAddress | null>
  | NeqFilterOperator<FormOfAddress | null>
  | InFilterOperator<FormOfAddress | null>
  | NinFilterOperator<FormOfAddress | null>;

export type PersonTypeFilterOperator =
  | EqFilterOperator<PersonType>
  | NeqFilterOperator<PersonType>
  | InFilterOperator<PersonType>
  | NinFilterOperator<PersonType>;

export type PersonGenderFilterOperator =
  | EqFilterOperator<PersonGender>
  | NeqFilterOperator<PersonGender>
  | InFilterOperator<PersonGender>
  | NinFilterOperator<PersonGender>;

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

export class PersonLastnameFilter extends ScalarPersonFilter<StringFilterOperator> {
  protected readonly propertyName = 'lastname';
}

export class PersonTypeFilter extends ScalarPersonFilter<PersonTypeFilterOperator> {
  protected readonly propertyName = 'type';
}

export class PersonGenderFilter extends ScalarPersonFilter<PersonGenderFilterOperator> {
  protected readonly propertyName = 'gender';
}

export class PersonTeacherCodeFilter extends ScalarPersonFilter<NullableStringFilterOperator> {
  protected readonly propertyName = 'teacherCode';
}

export class PersonFormOfAddressFilter extends ScalarPersonFilter<FormOfAddressFilterOperator> {
  protected readonly propertyName = 'formOfAddress';
}

export class PersonAccountIdFilter extends ScalarPersonFilter<NullableStringFilterOperator> {
  protected readonly propertyName = 'accountId';
}

export class PersonAccountFilter extends RelationalPersonFilter<AccountFilter> {
  protected readonly propertyName = 'accountId';
  protected readonly relatedCollection = 'accounts';
  protected override readonly nullable = true;
}
