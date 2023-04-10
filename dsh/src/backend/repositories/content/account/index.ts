import { aql } from 'arangojs';
import { ArangoRepository, WithId } from '../../arango';

export type FormOfAddress = 'formal' | 'informal';

export type AccountBase = {
  personId: string;
  username: string;
  email: string;
  password: string;
  formOfAddress: FormOfAddress;
  lastLogin: number | null;
  secondLastLogin: number | null;
};

export class AccountRepository extends ArangoRepository<
  'accounts',
  AccountBase
> {
  protected readonly collectionName = 'accounts';

  async updateLastLogin(
    id: string,
    lastLogin: number
  ): Promise<WithId<AccountBase>> {
    const res = await this.query<WithId<AccountBase>>(aql`
      LET doc = DOCUMENT(${this.collectionNameLiteral}, ${id})

      UPDATE doc WITH {
        secondLastLogin: doc.lastLogin,
        lastLogin: ${lastLogin}
      } IN ${this.collectionNameLiteral}

      RETURN MERGE(
        UNSET(NEW, "_key", "_id", "_rev"),
        {
          id: NEW._key,
          rev: NEW._rev
        }
      )
    `);

    return (await res.next())!;
  }
}
