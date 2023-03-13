import { ArangoRepository, WithId } from '../../arango';
import { MakeSearchQuery } from '../../search';
import { MakePatch } from '../../utils';
import { SchoolyearFilter } from './filters';

export type SchoolyearBase = {
  name: string;
  start: number;
  end: number;
};

export type Schoolyear = WithId<SchoolyearBase>;

export type SchoolyearPatch = MakePatch<SchoolyearBase>;

export type SchoolyearSearchQuery = MakeSearchQuery<
  Schoolyear,
  SchoolyearFilter
>;

export class SchoolyearRepository extends ArangoRepository<
  Schoolyear,
  SchoolyearBase,
  SchoolyearPatch,
  SchoolyearFilter,
  SchoolyearSearchQuery
> {
  protected readonly collectionName = 'schoolyears';
}
