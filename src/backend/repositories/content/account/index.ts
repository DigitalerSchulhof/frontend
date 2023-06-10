import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';

export const FORMS_OF_ADDRESS = ['formal', 'informal'] as const;
export type FormOfAddress = (typeof FORMS_OF_ADDRESS)[number];

export type AccountBase = {
  personId: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  passwordExpiresAt: number | null;
  lastLogin: number | null;
  secondLastLogin: number | null;
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
    formOfAddress: FormOfAddress;
  };
};

export class AccountRepository extends ArangoRepository<
  'accounts',
  AccountBase
> {
  protected readonly collectionName = 'accounts';

  async createForPerson(
    personId: string,
    post: Omit<AccountBase, 'personId'>,
    ifPersonRev?: string
  ): Promise<WithId<AccountBase>> {
    const res = await this.query<WithId<AccountBase>>(
      aql`
        INSERT ${post} INTO ${this.collectionNameLiteral}
        LET account = NEW

        UPDATE {
          _key: ${personId},
          _rev: ${ifPersonRev ?? ''},
        } WITH {
          accountId: account._key,
        } IN persons OPTIONS { ignoreRevs: ${ifPersonRev === undefined} }

        RETURN MERGE(
          UNSET(account, "_key", "_id", "_rev"),
          {
            id: account._key,
            rev: account._rev
          }
        )
      `
    );

    return (await res.next())!;
  }
}
