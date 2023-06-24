import { BaseFilter, BaseService, WithId } from './base';

export interface Account {
  personId: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  passwordExpiresAt: number | null;
  lastLogin: number | null;
  secondLastLogin: number | null;
  settings: AccountSettings;
}

export interface AccountSettings {
  emailOn: AccountSettingsNotifyOn;
  pushOn: AccountSettingsNotifyOn;
  considerNews: AccountSettingsConsiderNews;
  mailbox: AccountSettingsMailbox;
  profile: AccountSettingsProfile;
}

export interface AccountSettingsNotifyOn {
  newMessage: boolean;
  newSubstitution: boolean;
  newNews: boolean;
}

export interface AccountSettingsConsiderNews {
  newEvent: boolean;
  newBlog: boolean;
  newGallery: boolean;
  fileChanged: boolean;
}

export interface AccountSettingsMailbox {
  deleteAfter: number | null;
  deleteAfterInBin: number | null;
}

export interface AccountSettingsProfile {
  sessionTimeout: number;
  formOfAddress: FormOfAddress;
}

export const FORMS_OF_ADDRESS = ['formal', 'informal'] as const;
export type FormOfAddress = (typeof FORMS_OF_ADDRESS)[number];

export interface AccountService extends BaseService<Account> {
  create(
    data: Account,
    options?: {
      /**
       * Only creates the account if the person has the given rev.
       */
      ifPersonRev?: string;
    }
  ): Promise<WithId<Account>>;
}

export class AccountFilter extends BaseFilter<Account> {}
