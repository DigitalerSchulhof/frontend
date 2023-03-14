import { ArangoRepository } from '../../arango';

export type LevelBase = {
  name: string;
  schoolyearId: string;
};

export class LevelRepository extends ArangoRepository<'levels', LevelBase> {
  protected readonly collectionName = 'levels';
}
