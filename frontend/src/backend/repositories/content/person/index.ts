import { ArangoRepository } from '../../arango';

export type PersonBase = {
  accountId: string | null;
  firstname: string;
};

export class PersonRepository extends ArangoRepository<'persons', PersonBase> {
  protected readonly collectionName = 'persons';
}
