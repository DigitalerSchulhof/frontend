import { ArangoRepository } from '../../arango';

export type SchoolyearBase = {
  name: string;
  start: number;
  end: number;
};

export class SchoolyearRepository extends ArangoRepository<
  'schoolyears',
  SchoolyearBase
> {
  protected readonly collectionName = 'schoolyears';
}
