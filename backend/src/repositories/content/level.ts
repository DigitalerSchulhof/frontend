import { Database } from 'arangojs';
import { MakeSearchQuery } from '../search';
import { SimpleArangoRepository, SimpleRepository, WithId } from '../simple';
import { MakePatch } from '../utils';

export interface LevelBase {
  name: string;
  schoolyearId: string;
}

export type LevelPatch = MakePatch<Omit<LevelBase, 'schoolyearId'>>;

export type Level = WithId<LevelBase>;

export type LevelSearchQuery = MakeSearchQuery<
  Level,
  'id' | 'name' | 'schoolyearId'
>;

export type LevelRepository = SimpleRepository<
  Level,
  LevelBase,
  LevelPatch,
  LevelSearchQuery
>;

export class LevelRepositoryImpl
  extends SimpleArangoRepository<LevelRepository>
  implements LevelRepository
{
  constructor(db: Database) {
    super(db, 'levels');
  }
}
