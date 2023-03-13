import { ArangoRepository, WithId } from '../../arango';
import { MakeSearchQuery } from '../../search';
import { MakePatch } from '../../utils';
import { LevelFilter } from './filters';

export type LevelBase = {
  name: string;
  schoolyearId: string;
};

export type Level = WithId<LevelBase>;

export type LevelPatch = MakePatch<LevelBase>;

export type LevelSearchQuery = MakeSearchQuery<Level, LevelFilter>;

export class LevelRepository extends ArangoRepository<
  Level,
  LevelBase,
  LevelPatch,
  LevelFilter,
  LevelSearchQuery
> {
  protected readonly collectionName = 'levels';
}
