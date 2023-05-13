import { ArangoRepository } from '../../arango';

export type IdentityTheftBase = {
  personId: string;
  reportedAt: number;
};

export class IdentityTheftRepository extends ArangoRepository<
  'identity-thefts',
  IdentityTheftBase
> {
  protected readonly collectionName = 'identity-thefts';
}
