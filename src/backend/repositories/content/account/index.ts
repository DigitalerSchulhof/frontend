import { ArangoRepository } from '../../arango';

export enum FormOfAddress {
  Formal = 'formal',
  Informal = 'informal',
}

export type AccountBase = {
  personId: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  passwordExpiresAt: number | null;
  lastLogin: number | null;
  secondLastLogin: number | null;
  formOfAddress: FormOfAddress;
  settings: AccountSettings;
};

export type AccountSettings = {
  emailOn: {
    newMessage: boolean;
    newSubstitution: boolean;
    newNews: boolean;
  };
  pushOn: {
    newMessage: boolean;
    newSubstitution: boolean;
    newNews: boolean;
  };
  considerNews: {
    newEvent: boolean;
    newBlog: boolean;
    newGallery: boolean;
    fileChanged: boolean;
  };
  mailbox: {
    deleteAfter: number | null;
    deleteAfterInBin: number | null;
  };
  profile: {
    sessionTimeout: number;
  };
};

export class AccountRepository extends ArangoRepository<
  'accounts',
  AccountBase
> {
  protected readonly collectionName = 'accounts';
}
