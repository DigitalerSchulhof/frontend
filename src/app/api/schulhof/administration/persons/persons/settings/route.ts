import { AccountSettings } from '#/backend/repositories/content/account';
import {
  PERSON_MAILBOX_DELETE_AFTER_INVALID,
  PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID,
  PERSON_PROFILE_SESSION_TIMEOUT_INVALID,
} from '#/backend/validators/content/person';

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
      | typeof PERSON_MAILBOX_DELETE_AFTER_INVALID
      | typeof PERSON_MAILBOX_DELETE_AFTER_IN_BIN_INVALID
      | typeof PERSON_PROFILE_SESSION_TIMEOUT_INVALID;
  }[];
};
