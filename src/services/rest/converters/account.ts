import * as js from '#/services/interfaces/account';
import type { WithId as JsWithId } from '#/services/interfaces/base';
import type * as rest from '#/services/rest/services/account';
import type { WithId as RestWithId } from '#/services/rest/services/base';
import { idFromRest } from './base';

export function accountFromRest(
  account: RestWithId<rest.Account>
): JsWithId<js.Account> {
  return {
    ...idFromRest(account),
    personId: account.personId,
    username: account.username,
    email: account.email,
    password: Buffer.from(account.password, 'base64'),
    salt: Buffer.from(account.salt, 'base64'),
    passwordExpiresAt:
      account.passwordExpiresAt === null
        ? null
        : new Date(account.passwordExpiresAt),
    lastLogin: account.lastLogin === null ? null : new Date(account.lastLogin),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : new Date(account.secondLastLogin),
    settings: accountSettingsFromRest(account.settings),
  };
}

function accountSettingsFromRest(
  accountSettings: rest.AccountSettings
): js.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnFromRest(accountSettings.emailOn),
    pushOn: accountSettingsNotifyOnFromRest(accountSettings.pushOn),
    considerNews: accountSettingsConsiderNewsFromRest(
      accountSettings.considerNews
    ),
    mailbox: accountSettingsMailboxFromRest(accountSettings.mailbox),
    profile: accountSettingsProfileFromRest(accountSettings.profile),
  };
}

function accountSettingsNotifyOnFromRest(
  accountSettingsNotifyOn: rest.AccountSettingsNotifyOn
): js.AccountSettingsNotifyOn {
  return {
    newMessage: accountSettingsNotifyOn.newMessage,
    newSubstitution: accountSettingsNotifyOn.newSubstitution,
    newNews: accountSettingsNotifyOn.newNews,
  };
}

function accountSettingsConsiderNewsFromRest(
  accountSettingsConsiderNews: rest.AccountSettingsConsiderNews
): js.AccountSettingsConsiderNews {
  return {
    newEvent: accountSettingsConsiderNews.newEvent,
    newBlog: accountSettingsConsiderNews.newBlog,
    newGallery: accountSettingsConsiderNews.newGallery,
    fileChanged: accountSettingsConsiderNews.fileChanged,
  };
}

function accountSettingsMailboxFromRest(
  accountSettingsMailbox: rest.AccountSettingsMailbox
): js.AccountSettingsMailbox {
  return {
    deleteAfter: accountSettingsMailbox.deleteAfter,
    deleteAfterInBin: accountSettingsMailbox.deleteAfterInBin,
  };
}

function accountSettingsProfileFromRest(
  accountSettingsProfile: rest.AccountSettingsProfile
): js.AccountSettingsProfile {
  return {
    sessionTimeout: accountSettingsProfile.sessionTimeout,
    formOfAddress: formOfAddressFromRest(accountSettingsProfile.formOfAddress),
  };
}

function formOfAddressFromRest(
  formOfAddress: rest.FormOfAddress
): js.FormOfAddress {
  switch (formOfAddress) {
    case 'formal':
      return js.FormOfAddress.Formal;
    case 'informal':
      return js.FormOfAddress.Informal;
  }
}

export function accountToRest(account: js.Account): rest.Account;
export function accountToRest(
  account: Partial<js.Account>
): Partial<rest.Account>;
export function accountToRest(
  account: Partial<js.Account>
): Partial<rest.Account> {
  return {
    personId: account.personId,
    username: account.username,
    email: account.email,
    password: account.password?.toString('base64'),
    salt: account.salt?.toString('base64'),
    passwordExpiresAt: account.passwordExpiresAt?.getTime() ?? null,
    lastLogin: account.lastLogin?.getTime() ?? null,
    secondLastLogin: account.secondLastLogin?.getTime() ?? null,
    settings:
      account.settings === undefined
        ? undefined
        : accountSettingsToRest(account.settings),
  };
}

function accountSettingsToRest(
  accountSettings: js.AccountSettings
): rest.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnToRest(accountSettings.emailOn),
    pushOn: accountSettingsNotifyOnToRest(accountSettings.pushOn),
    considerNews: accountSettingsConsiderNewsToRest(
      accountSettings.considerNews
    ),
    mailbox: accountSettingsMailboxToRest(accountSettings.mailbox),
    profile: accountSettingsProfileToRest(accountSettings.profile),
  };
}

function accountSettingsNotifyOnToRest(
  accountSettingsNotifyOn: js.AccountSettingsNotifyOn
): rest.AccountSettingsNotifyOn {
  return {
    newMessage: accountSettingsNotifyOn.newMessage,
    newSubstitution: accountSettingsNotifyOn.newSubstitution,
    newNews: accountSettingsNotifyOn.newNews,
  };
}

function accountSettingsConsiderNewsToRest(
  accountSettingsConsiderNews: js.AccountSettingsConsiderNews
): rest.AccountSettingsConsiderNews {
  return {
    newEvent: accountSettingsConsiderNews.newEvent,
    newBlog: accountSettingsConsiderNews.newBlog,
    newGallery: accountSettingsConsiderNews.newGallery,
    fileChanged: accountSettingsConsiderNews.fileChanged,
  };
}

function accountSettingsMailboxToRest(
  accountSettingsMailbox: js.AccountSettingsMailbox
): rest.AccountSettingsMailbox {
  return {
    deleteAfter: accountSettingsMailbox.deleteAfter,
    deleteAfterInBin: accountSettingsMailbox.deleteAfterInBin,
  };
}

function accountSettingsProfileToRest(
  accountSettingsProfile: js.AccountSettingsProfile
): rest.AccountSettingsProfile {
  return {
    sessionTimeout: accountSettingsProfile.sessionTimeout,
    formOfAddress: formOfAddressToRest(accountSettingsProfile.formOfAddress),
  };
}

function formOfAddressToRest(
  formOfAddress: js.FormOfAddress
): rest.FormOfAddress {
  switch (formOfAddress) {
    case js.FormOfAddress.Formal:
      return 'formal';
    case js.FormOfAddress.Informal:
      return 'informal';
  }
}
