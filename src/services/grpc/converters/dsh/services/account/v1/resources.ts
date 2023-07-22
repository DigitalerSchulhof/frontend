import type * as js from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';
import * as grpc from '@dsh/protocols/dsh/services/account/v1/resources';
import {
  durationFromJs,
  durationToJs,
} from '../../../../google/protobuf/duration';
import {
  timestampFromJs,
  timestampToJs,
} from '../../../../google/protobuf/timestamp';

export function accountToJs(account: grpc.Account): WithId<js.Account> {
  return {
    id: account.id,
    rev: account.rev,
    updatedAt: timestampToJs(account.updated_at),
    createdAt: timestampToJs(account.created_at),
    personId: account.person_id,
    username: account.username,
    email: account.email,
    password: Buffer.from(account.password),
    salt: Buffer.from(account.salt),
    passwordExpiresAt: account.has_password_expires_at
      ? timestampToJs(account.password_expires_at)
      : null,
    lastLogin: account.has_last_login
      ? timestampToJs(account.last_login)
      : null,
    secondLastLogin: account.has_second_last_login
      ? timestampToJs(account.second_last_login)
      : null,
    settings: accountSettingsToJs(account.settings),
  };
}

function accountSettingsToJs(
  settings: grpc.AccountSettings
): js.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnToJs(settings.email_on),
    pushOn: accountSettingsNotifyOnToJs(settings.push_on),
    considerNews: accountSettingsConsiderNewsToJs(settings.consider_news),
    mailbox: accountSettingsMailboxToJs(settings.mailbox),
    profile: accountSettingsProfileToJs(settings.profile),
  };
}

function accountSettingsNotifyOnToJs(
  notifyOn: grpc.AccountSettingsNotifyOn
): js.AccountSettingsNotifyOn {
  return {
    newMessage: notifyOn.new_message,
    newNews: notifyOn.new_news,
    newSubstitution: notifyOn.new_substitution,
  };
}

function accountSettingsConsiderNewsToJs(
  considerNews: grpc.AccountSettingsConsiderNews
): js.AccountSettingsConsiderNews {
  return {
    newEvent: considerNews.new_event,
    newBlog: considerNews.new_blog,
    newGallery: considerNews.new_gallery,
    fileChanged: considerNews.file_changed,
  };
}

function accountSettingsMailboxToJs(
  mailbox: grpc.AccountSettingsMailbox
): js.AccountSettingsMailbox {
  return {
    deleteAfter: mailbox.has_delete_after
      ? durationToJs(mailbox.delete_after)
      : null,
    deleteAfterInBin: mailbox.has_delete_after_in_bin
      ? durationToJs(mailbox.delete_after_in_bin)
      : null,
  };
}

function accountSettingsProfileToJs(
  profile: grpc.AccountSettingsProfile
): js.AccountSettingsProfile {
  return {
    sessionTimeout: durationToJs(profile.session_timeout),
    formOfAddress: formOfAddressToJs(profile.form_of_address),
  };
}

function formOfAddressToJs(
  formOfAddress: grpc.AccountSettingsFormOfAddress
): js.FormOfAddress {
  switch (formOfAddress) {
    case grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_UNSPECIFIED:
      throw new Error('FORM_OF_ADDRESS_UNSPECIFIED is not supported.');
    case grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_FORMAL:
      return 'formal';
    case grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_INFORMAL:
      return 'informal';
  }
}

export function accountFromJs(
  account: Partial<WithId<js.Account>> | undefined
): grpc.Account | undefined {
  if (!account) return undefined;

  return new grpc.Account({
    id: account.id,
    rev: account.rev,
    updated_at: timestampFromJs(account.updatedAt),
    created_at: timestampFromJs(account.createdAt),
    person_id: account.personId,
    username: account.username,
    email: account.email,
    password: account.password,
    salt: account.salt,
    password_expires_at:
      account.passwordExpiresAt === null
        ? undefined
        : timestampFromJs(account.passwordExpiresAt),
    last_login:
      account.lastLogin === null
        ? undefined
        : timestampFromJs(account.lastLogin),
    second_last_login:
      account.secondLastLogin === null
        ? undefined
        : timestampFromJs(account.secondLastLogin),
    settings: accountSettingsFromJs(account.settings),
  });
}

function accountSettingsFromJs(
  settings: Partial<js.AccountSettings> | undefined
): grpc.AccountSettings | undefined {
  if (!settings) return undefined;

  return new grpc.AccountSettings({
    email_on: accountSettingsNotifyOnFromJs(settings.emailOn),
    push_on: accountSettingsNotifyOnFromJs(settings.pushOn),
    consider_news: accountSettingsConsiderNewsFromJs(settings.considerNews),
    mailbox: accountSettingsMailboxFromJs(settings.mailbox),
    profile: accountSettingsProfileFromJs(settings.profile),
  });
}

function accountSettingsNotifyOnFromJs(
  notifyOn: Partial<js.AccountSettingsNotifyOn> | undefined
): grpc.AccountSettingsNotifyOn | undefined {
  if (!notifyOn) return undefined;

  return new grpc.AccountSettingsNotifyOn({
    new_message: notifyOn.newMessage,
    new_news: notifyOn.newNews,
    new_substitution: notifyOn.newSubstitution,
  });
}

function accountSettingsConsiderNewsFromJs(
  considerNews: Partial<js.AccountSettingsConsiderNews> | undefined
): grpc.AccountSettingsConsiderNews | undefined {
  if (!considerNews) return undefined;

  return new grpc.AccountSettingsConsiderNews({
    new_event: considerNews.newEvent,
    new_blog: considerNews.newBlog,
    new_gallery: considerNews.newGallery,
    file_changed: considerNews.fileChanged,
  });
}

function accountSettingsMailboxFromJs(
  mailbox: Partial<js.AccountSettingsMailbox> | undefined
): grpc.AccountSettingsMailbox | undefined {
  if (!mailbox) return undefined;

  return new grpc.AccountSettingsMailbox({
    delete_after:
      mailbox.deleteAfter === null
        ? undefined
        : durationFromJs(mailbox.deleteAfter),
    delete_after_in_bin:
      mailbox.deleteAfterInBin === null
        ? undefined
        : durationFromJs(mailbox.deleteAfterInBin),
  });
}

function accountSettingsProfileFromJs(
  profile: Partial<js.AccountSettingsProfile> | undefined
): grpc.AccountSettingsProfile | undefined {
  if (!profile) return undefined;

  return new grpc.AccountSettingsProfile({
    session_timeout: durationFromJs(profile.sessionTimeout),
    form_of_address: formOfAddressFromJs(profile.formOfAddress),
  });
}

function formOfAddressFromJs(
  formOfAddress: Partial<js.FormOfAddress> | undefined
): grpc.AccountSettingsFormOfAddress | undefined {
  if (!formOfAddress) return undefined;

  switch (formOfAddress) {
    case 'formal':
      return grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_FORMAL;
    case 'informal':
      return grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_INFORMAL;
  }
}
