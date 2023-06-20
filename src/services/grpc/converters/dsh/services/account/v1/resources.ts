import * as js from '#/services/interfaces/account';
import { WithId } from '#/services/interfaces/base';
import * as grpc from '@dsh/protocols/dsh/services/account/v1/resources';
import {
  durationFromObject,
  durationToObject,
} from '../../../../google/protobuf/duration';
import {
  timestampFromObject,
  timestampToObject,
} from '../../../../google/protobuf/timestamp';

export function accountToObject(account: grpc.Account): WithId<js.Account> {
  return {
    id: account.id,
    rev: account.rev,
    updatedAt: timestampToObject(account.updated_at),
    createdAt: timestampToObject(account.created_at),
    personId: account.person_id,
    username: account.username,
    email: account.email,
    password: account.password,
    salt: account.salt,
    passwordExpiresAt: account.has_password_expires_at
      ? timestampToObject(account.password_expires_at)
      : null,
    lastLogin: account.has_last_login
      ? timestampToObject(account.last_login)
      : null,
    secondLastLogin: account.has_second_last_login
      ? timestampToObject(account.second_last_login)
      : null,
    settings: accountSettingsToObject(account.settings),
  };
}

function accountSettingsToObject(
  settings: grpc.AccountSettings
): js.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnToObject(settings.email_on),
    pushOn: accountSettingsNotifyOnToObject(settings.push_on),
    considerNews: accountSettingsConsiderNewsToObject(settings.consider_news),
    mailbox: accountSettingsMailboxToObject(settings.mailbox),
    profile: accountSettingsProfileToObject(settings.profile),
  };
}

function accountSettingsNotifyOnToObject(
  notifyOn: grpc.AccountSettingsNotifyOn
): js.AccountSettingsNotifyOn {
  return {
    newMessage: notifyOn.new_message,
    newNews: notifyOn.new_news,
    newSubstitution: notifyOn.new_substitution,
  };
}

function accountSettingsConsiderNewsToObject(
  considerNews: grpc.AccountSettingsConsiderNews
): js.AccountSettingsConsiderNews {
  return {
    newEvent: considerNews.new_event,
    newBlog: considerNews.new_blog,
    newGallery: considerNews.new_gallery,
    fileChanged: considerNews.file_changed,
  };
}

function accountSettingsMailboxToObject(
  mailbox: grpc.AccountSettingsMailbox
): js.AccountSettingsMailbox {
  return {
    deleteAfter: mailbox.has_delete_after
      ? durationToObject(mailbox.delete_after)
      : null,
    deleteAfterInBin: mailbox.has_delete_after_in_bin
      ? durationToObject(mailbox.delete_after_in_bin)
      : null,
  };
}

function accountSettingsProfileToObject(
  profile: grpc.AccountSettingsProfile
): js.AccountSettingsProfile {
  return {
    sessionTimeout: durationToObject(profile.session_timeout),
    formOfAddress: formOfAddressToObject(profile.form_of_address),
  };
}

function formOfAddressToObject(
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

export function accountFromObject(
  account: Partial<WithId<js.Account>> | null | undefined
): grpc.Account | undefined {
  if (!account) return undefined;

  return new grpc.Account({
    id: account.id,
    rev: account.rev,
    updated_at: timestampFromObject(account.updatedAt),
    created_at: timestampFromObject(account.createdAt),
    person_id: account.personId,
    username: account.username,
    email: account.email,
    password: account.password,
    salt: account.salt,
    password_expires_at: timestampFromObject(account.passwordExpiresAt),
    last_login: timestampFromObject(account.lastLogin),
    second_last_login: timestampFromObject(account.secondLastLogin),
    settings: accountSettingsFromObject(account.settings),
  });
}

function accountSettingsFromObject(
  settings: Partial<js.AccountSettings> | null | undefined
): grpc.AccountSettings | undefined {
  if (!settings) return undefined;

  return new grpc.AccountSettings({
    email_on: accountSettingsNotifyOnFromObject(settings.emailOn),
    push_on: accountSettingsNotifyOnFromObject(settings.pushOn),
    consider_news: accountSettingsConsiderNewsFromObject(settings.considerNews),
    mailbox: accountSettingsMailboxFromObject(settings.mailbox),
    profile: accountSettingsProfileFromObject(settings.profile),
  });
}

function accountSettingsNotifyOnFromObject(
  notifyOn: Partial<js.AccountSettingsNotifyOn> | null | undefined
): grpc.AccountSettingsNotifyOn | undefined {
  if (!notifyOn) return undefined;

  return new grpc.AccountSettingsNotifyOn({
    new_message: notifyOn.newMessage,
    new_news: notifyOn.newNews,
    new_substitution: notifyOn.newSubstitution,
  });
}

function accountSettingsConsiderNewsFromObject(
  considerNews: Partial<js.AccountSettingsConsiderNews> | null | undefined
): grpc.AccountSettingsConsiderNews | undefined {
  if (!considerNews) return undefined;

  return new grpc.AccountSettingsConsiderNews({
    new_event: considerNews.newEvent,
    new_blog: considerNews.newBlog,
    new_gallery: considerNews.newGallery,
    file_changed: considerNews.fileChanged,
  });
}

function accountSettingsMailboxFromObject(
  mailbox: Partial<js.AccountSettingsMailbox> | null | undefined
): grpc.AccountSettingsMailbox | undefined {
  if (!mailbox) return undefined;

  return new grpc.AccountSettingsMailbox({
    delete_after: durationFromObject(mailbox.deleteAfter),
    delete_after_in_bin: durationFromObject(mailbox.deleteAfterInBin),
  });
}

function accountSettingsProfileFromObject(
  profile: Partial<js.AccountSettingsProfile> | null | undefined
): grpc.AccountSettingsProfile | undefined {
  if (!profile) return undefined;

  return new grpc.AccountSettingsProfile({
    session_timeout: durationFromObject(profile.sessionTimeout),
    form_of_address: formOfAddressFromObject(profile.formOfAddress),
  });
}

function formOfAddressFromObject(
  formOfAddress: Partial<js.FormOfAddress> | null | undefined
): grpc.AccountSettingsFormOfAddress | undefined {
  if (!formOfAddress) return undefined;

  switch (formOfAddress) {
    case 'formal':
      return grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_FORMAL;
    case 'informal':
      return grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_INFORMAL;
  }
}
