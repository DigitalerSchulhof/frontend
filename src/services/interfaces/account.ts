import { BaseService } from './base';

export interface Account {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly personId: string;

  username: string;
  email: string;
  password: string;
  salt: string;
  passwordExpiresAt?: Date;
  lastLogin?: Date;
  secondLastLogin?: Date;
  settings: AccountSettings;
}

export type CreateAccount = Omit<
  Account,
  'id' | 'rev' | 'updatedAt' | 'createdAt' | 'personId'
>;

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
  deleteAfter?: number;
  deleteAfterInBin?: number;
}

export interface AccountSettingsProfile {
  sessionTimeout?: number;
  formOfAddress: FormOfAddress;
}

export type FormOfAddress = 'formal' | 'informal';

export interface AccountService
  extends Omit<BaseService<Account, CreateAccount>, 'create'> {
  create(data: CreateAccount, personId: string): Promise<Account>;
}
