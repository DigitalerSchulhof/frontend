import { ArangoRepository } from '../../arango';

export type FormOfAddress = 'formal' | 'informal';

export type AccountBase = {
  personId: string;
  username: string;
  email: string;
  password: string;
  formOfAddress: FormOfAddress;
};

export class AccountRepository extends ArangoRepository<
  'accounts',
  AccountBase
> {
  protected readonly collectionName = 'accounts';
}
