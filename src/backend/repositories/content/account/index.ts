import {
  AccountPasswordFilter,
  AccountUsernameFilter,
} from '#/backend/repositories/content/account/filters';
import { AndFilter } from '#/backend/repositories/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
import { Paginated } from '#/backend/repositories/search';
import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';

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

  async getByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<Paginated<WithId<AccountBase>>> {
    const filter = new AndFilter(
      new AccountUsernameFilter(new EqFilterOperator(username)),
      new AccountPasswordFilter(
        (variableName) =>
          new EqFilterOperator<string>(
            aql`
              SHA512(CONCAT(${password}, ${variableName}.salt))
            `
          )
      )
    );

    const res = await this.search({ filter });

    return res;
  }
}
