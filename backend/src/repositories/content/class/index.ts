import { ArangoRepository } from '../../arango';

export type ClassBase = {
  name: string;
  levelId: string;
};

export class ClassRepository extends ArangoRepository<'classes', ClassBase> {
  protected readonly collectionName = 'classes';
}
