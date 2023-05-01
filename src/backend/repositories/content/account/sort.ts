import { Sort } from '../../sort';

export abstract class AccountSort extends Sort<'account'> {}

export class AccountIdSort extends AccountSort {
  protected readonly propertyName = '_key';
}

export class AccountUsernameSort extends AccountSort {
  protected readonly propertyName = 'username';
}

export class AccountEmailSort extends AccountSort {
  protected readonly propertyName = 'email';
}

export class AccountPasswordSort extends AccountSort {
  protected readonly propertyName = 'password';
}

export class AccountSaltSort extends AccountSort {
  protected readonly propertyName = 'salt';
}

export class AccountPasswordExpiresSort extends AccountSort {
  protected readonly propertyName = 'passwordExpires';
}

export class AccountPersonIdSort extends AccountSort {
  protected readonly propertyName = 'personId';
}

export class AccountLastLoginSort extends AccountSort {
  protected readonly propertyName = 'lastLogin';
}

export class AccountSecondLastLoginSort extends AccountSort {
  protected readonly propertyName = 'secondLastLogin';
}

export class AccountFormOfAddressSort extends AccountSort {
  protected readonly propertyName = 'formOfAddress';
}

export class AccountSettingsEmailOnNewMessageSort extends AccountSort {
  protected readonly propertyName = 'settings.emailOn.newMessage';
}
export class AccountSettingsEmailOnNewSubstitutionSort extends AccountSort {
  protected readonly propertyName = 'settings.emailOn.newSubstitution';
}
export class AccountSettingsEmailOnNewNewsSort extends AccountSort {
  protected readonly propertyName = 'settings.emailOn.newNews';
}
export class AccountSettingsPushOnNewMessageSort extends AccountSort {
  protected readonly propertyName = 'settings.pushOn.newMessage';
}
export class AccountSettingsPushOnNewSubstitutionSort extends AccountSort {
  protected readonly propertyName = 'settings.pushOn.newSubstitution';
}
export class AccountSettingsPushOnNewNewsSort extends AccountSort {
  protected readonly propertyName = 'settings.pushOn.newNews';
}
export class AccountSettingsConsiderNewsNewEventSort extends AccountSort {
  protected readonly propertyName = 'settings.considerNews.newEvent';
}
export class AccountSettingsConsiderNewsNewBlogSort extends AccountSort {
  protected readonly propertyName = 'settings.considerNews.newBlog';
}
export class AccountSettingsConsiderNewsNewGallerySort extends AccountSort {
  protected readonly propertyName = 'settings.considerNews.newGallery';
}
export class AccountSettingsConsiderNewsFileChangedSort extends AccountSort {
  protected readonly propertyName = 'settings.considerNews.fileChanged';
}
export class AccountSettingsMailboxDeleteAfterSort extends AccountSort {
  protected readonly propertyName = 'settings.mailbox.deleteAfter';
}
export class AccountSettingsMailboxDeleteAfterInBinSort extends AccountSort {
  protected readonly propertyName = 'settings.mailbox.deleteAfterInBin';
}
export class AccountSettingsProfileSessionTimeoutSort extends AccountSort {
  protected readonly propertyName = 'settings.profile.sessionTimeout';
}
