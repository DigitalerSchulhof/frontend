import type { BaseService, WithId } from './base';

export interface Account {
  personId: string;
  username: string;
  email: string;
  password: Buffer;
  salt: Buffer;
  passwordExpiresAt: Date | null;
  lastLogin: Date | null;
  secondLastLogin: Date | null;
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

export enum FormOfAddress {
  Formal,
  Informal,
}

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
