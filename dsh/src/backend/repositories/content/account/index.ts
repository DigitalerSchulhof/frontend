import { aql } from 'arangojs';
import { ArangoRepository } from '../../arango';

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

  // TODO: Should Date be stored as number?
  async updateLastLogin(id: string, lastLogin: Date): Promise<void> {
    await this.query(aql`
      LET doc = DOCUMENT(${this.collectionNameLiteral}, ${id})

      UPDATE doc WITH {
        lastLogin: ${lastLogin},
        secondLastLogin: doc.lastLogin
      } IN ${this.collectionNameLiteral}
    `);
  }
}
