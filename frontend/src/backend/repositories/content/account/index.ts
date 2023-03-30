import { ArangoRepository } from '../../arango';

export type AccountBase = {
  personId: string;
  username: string;
  password: string;
};

export class AccountRepository extends ArangoRepository<
  'accounts',
  AccountBase
> {
  protected readonly collectionName = 'accounts';
}
