import { AccountSettings } from '#/backend/repositories/content/account';
import {
  ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID,
  ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID,
  ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID,
} from '#/backend/validators/content/account';

export type SettingsInput = {
  personId: string;
  settings: AccountSettings;
};

export type SettingsOutputOk = {
  code: 'OK';
};

export type SettingsOutputNotOk = {
  code: 'NOT_OK';
  errors: {
    code:
      | typeof ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID
      | typeof ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID
      | typeof ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID;
  }[];
};
