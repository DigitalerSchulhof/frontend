import { Sort } from '../../sort';

export abstract class PersonSort extends Sort<'person'> {}

export class PersonIdSort extends PersonSort {
  protected readonly propertyName = '_key';
}

export class PersonFirstnameSort extends PersonSort {
  protected readonly propertyName = 'firstname';
}

export class PersonLastnameSort extends PersonSort {
  protected readonly propertyName = 'lastname';
}

export class PersonTypeSort extends PersonSort {
  protected readonly propertyName = 'type';
}

export class PersonGenderSort extends PersonSort {
  protected readonly propertyName = 'gender';
}

export class PersonTeacherCodeSort extends PersonSort {
  protected readonly propertyName = 'teacherCode';
}

export class PersonFormOfAddressSort extends PersonSort {
  protected readonly propertyName = 'formOfAddress';
}

export class PersonAccountIdSort extends PersonSort {
  protected readonly propertyName = 'accountId';
}

export class PersonSettingsEmailOnNewMessageSort extends PersonSort {
  protected readonly propertyName = 'settings.emailOn.newMessage';
}
export class PersonSettingsEmailOnNewSubstitutionSort extends PersonSort {
  protected readonly propertyName = 'settings.emailOn.newSubstitution';
}
export class PersonSettingsEmailOnNewNewsSort extends PersonSort {
  protected readonly propertyName = 'settings.emailOn.newNews';
}
export class PersonSettingsPushOnNewMessageSort extends PersonSort {
  protected readonly propertyName = 'settings.pushOn.newMessage';
}
export class PersonSettingsPushOnNewSubstitutionSort extends PersonSort {
  protected readonly propertyName = 'settings.pushOn.newSubstitution';
}
export class PersonSettingsPushOnNewNewsSort extends PersonSort {
  protected readonly propertyName = 'settings.pushOn.newNews';
}
export class PersonSettingsConsiderNewsNewEventSort extends PersonSort {
  protected readonly propertyName = 'settings.considerNews.newEvent';
}
export class PersonSettingsConsiderNewsNewBlogSort extends PersonSort {
  protected readonly propertyName = 'settings.considerNews.newBlog';
}
export class PersonSettingsConsiderNewsNewGallerySort extends PersonSort {
  protected readonly propertyName = 'settings.considerNews.newGallery';
}
export class PersonSettingsConsiderNewsFileChangedSort extends PersonSort {
  protected readonly propertyName = 'settings.considerNews.fileChanged';
}
export class PersonSettingsMailboxDeleteAfterSort extends PersonSort {
  protected readonly propertyName = 'settings.mailbox.deleteAfter';
}
export class PersonSettingsMailboxDeleteAfterInBinSort extends PersonSort {
  protected readonly propertyName = 'settings.mailbox.deleteAfterInBin';
}
export class PersonSettingsProfileSessionTimeoutSort extends PersonSort {
  protected readonly propertyName = 'settings.profile.sessionTimeout';
}
