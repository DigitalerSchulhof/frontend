import { ArangoRepository } from '../../arango';

export type AccountBase = {
  email: string;
};

export class AccountRepository extends ArangoRepository<
  'accounts',
  AccountBase
> {
  protected readonly collectionName = 'accounts';
}
