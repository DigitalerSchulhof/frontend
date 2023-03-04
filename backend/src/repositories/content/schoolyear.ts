import { Database } from 'arangojs';
import { MakeSearchQuery } from '../search';
import { SimpleArangoRepository, SimpleRepository, WithId } from '../simple';
import { MakePatch } from '../utils';

export interface SchoolyearBase {
  name: string;
  start: number;
  end: number;
}

export type SchoolyearPatch = MakePatch<SchoolyearBase>;

export type Schoolyear = WithId<SchoolyearBase>;

export type SchoolyearSearchQuery = MakeSearchQuery<
  Schoolyear,
  'id' | 'name' | 'start' | 'end'
>;

export type SchoolyearRepository = SimpleRepository<
  Schoolyear,
  SchoolyearBase,
  SchoolyearPatch,
  SchoolyearSearchQuery
>;

export class SchoolyearRepositoryImpl
  extends SimpleArangoRepository<SchoolyearRepository>
  implements SchoolyearRepository
{
  constructor(db: Database) {
    super(db, 'schoolyears');
  }
}
