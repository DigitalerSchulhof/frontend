import { FormOfAddress } from '#/backend/repositories/content/account';
import { MaybeArray } from '../../../utils';
import { Filter, RelationalFilter, ScalarFilter } from '../../filters';
import {
  BooleanFilterOperator,
  EqFilterOperator,
  FilterOperator,
  IDFilterOperator,
  InFilterOperator,
  NeqFilterOperator,
  NinFilterOperator,
  NullableNumberFilterOperator,
  NumberFilterOperator,
  StringFilterOperator,
} from '../../filters/operators';
import { PersonFilter, ScalarPersonFilter } from '../person/filters';

export type FormOfAddressFilterOperator =
  | EqFilterOperator<FormOfAddress | null>
  | NeqFilterOperator<FormOfAddress | null>
  | InFilterOperator<FormOfAddress | null>
  | NinFilterOperator<FormOfAddress | null>;

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

export class AccountSaltFilter extends ScalarAccountFilter<StringFilterOperator> {
  protected readonly propertyName = 'salt';
}

export class AccountPasswordExpiresFilter extends ScalarAccountFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'passwordExpires';
}

export class AccountLastLoginFilter extends ScalarPersonFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'lastLogin';
}

export class AccountSecondLastLoginFilter extends ScalarPersonFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'secondLastLogin';
}

export class AccountFormOfAddressFilter extends ScalarAccountFilter<FormOfAddressFilterOperator> {
  protected readonly propertyName = 'formOfAddress';
}

export class AccountSettingsEmailOnNewMessageFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.emailOn.newMessage';
}
export class AccountSettingsEmailOnNewSubstitutionFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.emailOn.newSubstitution';
}
export class AccountSettingsEmailOnNewNewsFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.emailOn.newNews';
}
export class AccountSettingsPushOnNewMessageFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.pushOn.newMessage';
}
export class AccountSettingsPushOnNewSubstitutionFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.pushOn.newSubstitution';
}
export class AccountSettingsPushOnNewNewsFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.pushOn.newNews';
}
export class AccountSettingsConsiderNewsNewEventFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.considerNews.newEvent';
}
export class AccountSettingsConsiderNewsNewBlogFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.considerNews.newBlog';
}
export class AccountSettingsConsiderNewsNewGalleryFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.considerNews.newGallery';
}
export class AccountSettingsConsiderNewsFileChangedFilter extends ScalarAccountFilter<BooleanFilterOperator> {
  protected readonly propertyName = 'settings.considerNews.fileChanged';
}
export class AccountSettingsMailboxDeleteAfterFilter extends ScalarAccountFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'settings.mailbox.deleteAfter';
}
export class AccountSettingsMailboxDeleteAfterInBinFilter extends ScalarAccountFilter<NullableNumberFilterOperator> {
  protected readonly propertyName = 'settings.mailbox.deleteAfterInBin';
}
export class AccountSettingsProfileSessionTimeoutFilter extends ScalarAccountFilter<NumberFilterOperator> {
  protected readonly propertyName = 'settings.profile.sessionTimeout';
}
