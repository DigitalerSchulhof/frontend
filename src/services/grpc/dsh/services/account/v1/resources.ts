import {
  durationToObject,
  durationFromObject,
} from '#/services/grpc/google/protobuf/duration';
import {
  timestampToObject,
  timestampFromObject,
} from '#/services/grpc/google/protobuf/timestamp';
import * as js from '#/services/interfaces/account';
import * as grpc from '@dsh/protocols/dsh/services/account/v1/resources';

export function accountToObject(account: grpc.Account): js.Account {
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
    passwordExpiresAt: timestampToObject(account.password_expires_at),
    lastLogin: timestampToObject(account.last_login),
    secondLastLogin: timestampToObject(account.second_last_login),
    settings: accountSettingsToObject(account.settings),
  };
}

export function accountSettingsToObject(
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

export function accountSettingsNotifyOnToObject(
  notifyOn: grpc.AccountSettingsNotifyOn
): js.AccountSettingsNotifyOn {
  return {
    newMessage: notifyOn.new_message,
    newNews: notifyOn.new_news,
    newSubstitution: notifyOn.new_substitution,
  };
}

export function accountSettingsConsiderNewsToObject(
  considerNews: grpc.AccountSettingsConsiderNews
): js.AccountSettingsConsiderNews {
  return {
    newEvent: considerNews.new_event,
    newBlog: considerNews.new_blog,
    newGallery: considerNews.new_gallery,
    fileChanged: considerNews.file_changed,
  };
}

export function accountSettingsMailboxToObject(
  mailbox: grpc.AccountSettingsMailbox
): js.AccountSettingsMailbox {
  return {
    deleteAfter: durationToObject(mailbox.delete_after),
    deleteAfterInBin: durationToObject(mailbox.delete_after_in_bin),
  };
}

export function accountSettingsProfileToObject(
  profile: grpc.AccountSettingsProfile
): js.AccountSettingsProfile {
  return {
    sessionTimeout: durationToObject(profile.session_timeout),
    formOfAddress: formOfAddressToObject(profile.form_of_address),
  };
}

export function formOfAddressToObject(
  formOfAddress: grpc.AccountSettingsFormOfAddress
): js.FormOfAddress {
  switch (formOfAddress) {
    case grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_UNSPECIFIED:
      throw new Error('FORM_OF_ADDRESS_UNSPECIFIED is not supported');
    case grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_FORMAL:
      return 'formal';
    case grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_INFORMAL:
      return 'informal';
  }
}

export function accountFromObject(account: js.Account): grpc.Account {
  return {
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
  };
}

export function accountSettingsFromObject(
  settings: js.AccountSettings
): grpc.AccountSettings {
  return new grpc.AccountSettings({
    email_on: accountSettingsNotifyOnFromObject(settings.emailOn),
    push_on: accountSettingsNotifyOnFromObject(settings.pushOn),
    consider_news: accountSettingsConsiderNewsFromObject(settings.considerNews),
    mailbox: accountSettingsMailboxFromObject(settings.mailbox),
    profile: accountSettingsProfileFromObject(settings.profile),
  });
}

export function accountSettingsNotifyOnFromObject(
  notifyOn: js.AccountSettingsNotifyOn
): grpc.AccountSettingsNotifyOn {
  return new grpc.AccountSettingsNotifyOn({
    new_message: notifyOn.newMessage,
    new_news: notifyOn.newNews,
    new_substitution: notifyOn.newSubstitution,
  });
}

export function accountSettingsConsiderNewsFromObject(
  considerNews: js.AccountSettingsConsiderNews
): grpc.AccountSettingsConsiderNews {
  return new grpc.AccountSettingsConsiderNews({
    new_event: considerNews.newEvent,
    new_blog: considerNews.newBlog,
    new_gallery: considerNews.newGallery,
    file_changed: considerNews.fileChanged,
  });
}

export function accountSettingsMailboxFromObject(
  mailbox: js.AccountSettingsMailbox
): grpc.AccountSettingsMailbox {
  return new grpc.AccountSettingsMailbox({
    delete_after: durationFromObject(mailbox.deleteAfter),
    delete_after_in_bin: durationFromObject(mailbox.deleteAfterInBin),
  });
}

export function accountSettingsProfileFromObject(
  profile: js.AccountSettingsProfile
): grpc.AccountSettingsProfile {
  return new grpc.AccountSettingsProfile({
    session_timeout: durationFromObject(profile.sessionTimeout),
    form_of_address: formOfAddressFromObject(profile.formOfAddress),
  });
}

export function formOfAddressFromObject(
  formOfAddress: js.FormOfAddress
): grpc.AccountSettingsFormOfAddress {
  switch (formOfAddress) {
    case 'formal':
      return grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_FORMAL;
    case 'informal':
      return grpc.AccountSettingsFormOfAddress.FORM_OF_ADDRESS_INFORMAL;
  }
}
